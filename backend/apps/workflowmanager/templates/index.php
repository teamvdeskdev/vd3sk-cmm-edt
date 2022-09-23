<?php
script('workflowmanager','backbone');
script('workflowmanager','lodash');
script('workflowmanager','joint');
script('workflowmanager','workflow');
script('workflowmanager','script');
style('workflowmanager', 'joint');
style('workflowmanager', 'style');
?>
<div id="app">
	<div id="app-navigation">		
		<?php print_unescaped($this->inc('navigation/index')); ?>	
		<?php print_unescaped($this->inc('settings/index')); ?>
	</div>	
	<div id="app-content">
	<div id="app-content-wrapper">
			<?php print_unescaped($this->inc('content/index')); ?>
		</div>
	</div>
</div>
<?php // phpinfo(); ?>
