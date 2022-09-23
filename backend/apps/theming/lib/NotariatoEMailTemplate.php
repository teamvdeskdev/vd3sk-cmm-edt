<?php
namespace OCA\Theming;

use OC\Mail\EMailTemplate;

/**
 * Class NotariatoEMailTemplate
 */
class NotariatoEMailTemplate extends EMailTemplate
{
	protected $header = <<<EOF
<table align="center" class="wrapper header float-center" style="Margin:0 auto;background:#8a8a8a;background-color:#ffffff;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:100%%">
	<tr style="padding:0;text-align:left;vertical-align:top">
		<td class="wrapper-inner" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:20px;text-align:left;vertical-align:top;word-wrap:break-word">
			<table align="center" class="container" style="Margin:0 auto;background:0 0;border-collapse:collapse;border-spacing:0;margin:0 auto;padding:0;text-align:inherit;vertical-align:top;width:580px">
				<tbody>
				<tr style="padding:0;text-align:left;vertical-align:top">
					<td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
						<table class="row collapse" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%%">
							<tbody>
							<tr style="padding:0;text-align:left;vertical-align:top">
								<center data-parsed="" style="min-width:580px;width:100%%">
									<img class="logo float-center" src="https://hub.liveboxcloud.com/customers_logos/logo_brand_notbox.png" alt="https://hub.liveboxcloud.com/customers_logos/logo_brand_notbox.png" align="center" style="-ms-interpolation-mode:bicubic;Margin:0 auto;clear:both;display:block;float:none;margin:0 auto;outline:0;text-align:center;text-decoration:none" height="50">
								</center>
							</tr>
							</tbody>
						</table>
					</td>
				</tr>
				</tbody>
			</table>
		</td>
	</tr>
</table>
<table class="spacer float-center" style="Margin:0 auto;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:100%%">
	<tbody>
	<tr style="padding:0;text-align:left;vertical-align:top">
		<td height="80px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:80px;font-weight:400;hyphens:auto;line-height:80px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
	</tr>
	</tbody>
</table>
EOF;

protected $button = <<<EOF
<table class="spacer" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%%">
	<tbody>
	<tr style="padding:0;text-align:left;vertical-align:top">
		<td height="50px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:50px;font-weight:400;hyphens:auto;line-height:50px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
	</tr>
	</tbody>
</table>
<table align="center" class="row btn-group" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%%">
	<tbody>
	<tr style="padding:0;text-align:left;vertical-align:top">
		<th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#0a0a0a;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:30px;padding-left:30px;padding-right:30px;text-align:left;width:550px">
			<table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%%">
				<tr style="padding:0;text-align:left;vertical-align:top">
					<th style="Margin:0;color:#0a0a0a;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
						<center data-parsed="" style="min-width:490px;width:100%%">
							<table class="button btn default primary float-center" style="Margin:0;border-collapse:collapse;border-spacing:0;display:inline-block;float:none;margin:0;max-height:40px;padding:0;text-align:center;vertical-align:top;width:auto;background:%1\$s;color:#fefefe;background-color:#EF3109;">
								<tr style="padding:0;text-align:left;vertical-align:top">
									<td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
										<table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%%">
											<tr style="padding:0;text-align:left;vertical-align:top">
												<td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border:0 solid %2\$;border-collapse:collapse!important;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
													<a href="%3\$s" style="Margin:0;border:0 solid %4\$s;border-radius:2px;color:#FFFFFF;display:inline-block;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:16px;font-weight:regular;line-height:1.3;margin:0;padding:10px 25px 10px 25px;text-align:left;outline:1px solid %5\$s;text-decoration:none">Apri Test_Drive_05-Documento di testo.md</a>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</center>
					</th>
					<th class="expander" style="Margin:0;color:#0a0a0a;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th>
				</tr>
			</table>
		</th>
	</tr>
	</tbody>
</table>
EOF;

protected $footer = <<<EOF
<table class="spacer float-center" style="Margin:0 auto;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:100%%">
	<tbody>
	<tr style="padding:0;text-align:left;vertical-align:top">
		<td height="60px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:60px;font-weight:400;hyphens:auto;line-height:60px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
	</tr>
	</tbody>
</table>
<table align="center" class="wrapper footer float-center" style="Margin:0 auto;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:100%%">
	<tr style="padding:0;text-align:left;vertical-align:top">
		<td class="wrapper-inner" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
			<center data-parsed="" style="min-width:580px;width:100%%">
				<table class="spacer float-center" style="Margin:0 auto;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:100%%">
					<tbody>
					<tr style="padding:0;text-align:left;vertical-align:top">
						<td height="15px" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:15px;font-weight:400;hyphens:auto;line-height:15px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&#xA0;</td>
					</tr>
					</tbody>
				</table>
				<p class="text-center float-center" align="center" style="Margin:0;Margin-bottom:10px;color:#C8C8C8;font-family:Lucida Grande,Geneva,Verdana,sans-serif;font-size:12px;font-weight:400;line-height:16px;margin:0;margin-bottom:10px;padding:0;text-align:center">Powered by LB</p>
			</center>
		</td>
	</tr>
</table>
EOF;
}
