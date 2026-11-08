using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows.Forms;

internal static class AutoWrite {
    delegate IntPtr Hook(int code, IntPtr message, IntPtr data);
    [DllImport("user32.dll", SetLastError=true)] static extern IntPtr SetWindowsHookEx(int type, Hook fn, IntPtr module, uint thread);
    [DllImport("user32.dll")] static extern bool UnhookWindowsHookEx(IntPtr handle);
    [DllImport("user32.dll")] static extern IntPtr CallNextHookEx(IntPtr handle,int code,IntPtr msg,IntPtr data);
    [DllImport("kernel32.dll")] static extern IntPtr GetModuleHandle(string name);
    [DllImport("user32.dll")] static extern short GetAsyncKeyState(int vk);
    [DllImport("user32.dll")] static extern short GetKeyState(int vk);
    [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr hwnd,IntPtr pid);
    [DllImport("user32.dll")] static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] static extern bool GetGUIThreadInfo(uint thread,ref Gui info);
    [DllImport("user32.dll")] static extern IntPtr GetKeyboardLayout(uint thread);
    [DllImport("user32.dll",CharSet=CharSet.Unicode)] static extern int ToUnicodeEx(uint vk,uint scan,byte[] state,StringBuilder text,int size,uint flags,IntPtr layout);
    [DllImport("user32.dll")] static extern uint SendInput(uint count,Input[] inputs,int size);
    [StructLayout(LayoutKind.Sequential)] struct Gui { public int size,flags; public IntPtr active,focus,capture,menu,move,caret; public int left,top,right,bottom; }
    [StructLayout(LayoutKind.Sequential)] struct Key { public uint vk,scan,flags,time; public UIntPtr extra; }
    // INPUT is 40 bytes on Win64. The keyboard union starts at byte 8.
    [StructLayout(LayoutKind.Explicit,Size=40)] struct Input {
        [FieldOffset(0)] public uint type;
        [FieldOffset(8)] public ushort key;
        [FieldOffset(10)] public ushort scan;
        [FieldOffset(12)] public uint flags;
        [FieldOffset(24)] public UIntPtr extra;
    }
    static readonly UIntPtr marker = new UIntPtr(0x50414C46);
    static readonly Hook keyboard = OnKey, mouse = OnMouse;
    static readonly Regex pairs = new Regex("sh|ch|[go]['’ʻ‘ʼ`]", RegexOptions.IgnoreCase|RegexOptions.CultureInvariant);
    static readonly StringBuilder word = new StringBuilder();
    static IntPtr focus;
    static bool Down(int key) {return GetAsyncKeyState(key)<0;}
    static IntPtr OnMouse(int code,IntPtr msg,IntPtr data){
        if(code>=0 && msg.ToInt32()!=0x200) word.Clear();
        return CallNextHookEx(IntPtr.Zero,code,msg,data);
    }
    static void Pair(List<Input> inputs,ushort vk,ushort scan,uint flags){
        var item=new Input{type=1,key=vk,scan=scan,flags=flags,extra=marker};
        inputs.Add(item);item.flags|=2;inputs.Add(item);
    }
    static bool ReplaceWord(){
        string from=word.ToString();word.Clear();
        string to=pairs.Replace(from,m=>{
            char c=m.Value[0];char mapped="şçğö"["scgo".IndexOf(char.ToLowerInvariant(c))];
            return (char.IsUpper(c)?char.ToUpperInvariant(mapped):mapped).ToString();
        });
        if(from==to)return false;
        var events=new List<Input>();
        foreach(char c in from)Pair(events,8,0,0);
        foreach(char c in to+" ")Pair(events,0,c,4);
        return SendInput((uint)events.Count,events.ToArray(),Marshal.SizeOf(typeof(Input)))==events.Count;
    }
    static IntPtr OnKey(int code,IntPtr msg,IntPtr data){
        if(code>=0 && (msg.ToInt32()==0x100 || msg.ToInt32()==0x104)){
            var key=(Key)Marshal.PtrToStructure(data,typeof(Key));
            if(!key.extra.Equals(marker)){
                uint thread=GetWindowThreadProcessId(GetForegroundWindow(),IntPtr.Zero);
                var gui=new Gui{size=Marshal.SizeOf(typeof(Gui))};
                if(!GetGUIThreadInfo(thread,ref gui)||gui.focus!=focus){word.Clear();focus=gui.focus;}
                if(focus==IntPtr.Zero||Down(17)||Down(18)||Down(91)||Down(92))word.Clear();
                else if(key.vk==32){if(ReplaceWord())return new IntPtr(1);}
                else if(key.vk==8){if(word.Length>0)word.Length--;}
                else if(key.vk!=16 && key.vk!=160 && key.vk!=161 && key.vk!=20){
                    var state=new byte[256];state[16]=(byte)(Down(16)?128:0);state[20]=(byte)(GetKeyState(20)&1);
                    var chars=new StringBuilder(8);
                    int n=ToUnicodeEx(key.vk,key.scan,state,chars,8,4,GetKeyboardLayout(thread));
                    if(n==1 && (char.IsLetter(chars[0])||"'’ʻ‘ʼ`".IndexOf(chars[0])>=0)){
                        if(word.Length==256)word.Clear();
                        word.Append(chars[0]);
                    } else word.Clear();
                }
            }
        }
        return CallNextHookEx(IntPtr.Zero,code,msg,data);
    }
    [STAThread] static void Main(){
        var module=GetModuleHandle(null);
        var k=SetWindowsHookEx(13,keyboard,module,0);var m=SetWindowsHookEx(14,mouse,module,0);
        if(k==IntPtr.Zero||m==IntPtr.Zero)Environment.Exit(2);
        Console.WriteLine("ready");
        // EOF means the desktop parent has exited.
        var watcher=new System.Threading.Thread(()=>{Console.In.ReadLine();Environment.Exit(0);});
        watcher.IsBackground=true;watcher.Start();
        Application.Run();
        UnhookWindowsHookEx(k);UnhookWindowsHookEx(m);
    }
}
