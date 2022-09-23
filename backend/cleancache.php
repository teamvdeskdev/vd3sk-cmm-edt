<?php

if (opcache_reset()) {
   echo "Cache cleaned!";
}
else {
   echo "Cache NOT cleaned" ;
}

?>
