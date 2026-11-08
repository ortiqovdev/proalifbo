use strict;
use warnings;
use utf8;
use Encode qw(decode);
binmode STDOUT, ':encoding(UTF-8)';
my $word=decode('UTF-8', $ENV{'ESPANSO_WORD'} // '');
my %letters=('s'=>'ş','c'=>'ç','g'=>'ğ','o'=>'ö');
$word =~ s{(sh|ch|[go]['’ʻ‘ʼ`])}{my $first=substr($1,0,1); my $char=$letters{lc $first}; $first eq uc($first) ? uc($char) : $char}gei;
print $word;
