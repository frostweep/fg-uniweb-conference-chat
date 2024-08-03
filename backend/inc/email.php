<?php


class Email
{
   public static function postEmail($email, $subjectInc, $contentSubject, $content, $action, $actionUrl){

       $headers = "From: Frostweep Games Services <noreply@services.frostweepgames.com> \r\n";
       $headers .= "MIME-Version: 1.0\r\n";
       $headers .= "Content-Type: text/html; charset=utf-8\r\n";

       $template = "";
       $fh = fopen(__DIR__.'/email/emailTemplate.txt','r');
       while ($line = fgets($fh)) {
           $template.= $line;
       }
       fclose($fh);

       $template = str_replace("{TITLE}", $subjectInc, $template);
       $template = str_replace("{SUBJECT}", $subjectInc, $template);
       $template = str_replace("{CONTENT_SUBJECT}", $contentSubject, $template);
       $template = str_replace("{CONTENT}", $content, $template);
       $template = str_replace("{ACTION_URL}", $actionUrl, $template);
       $template = str_replace("{ACTION}", $action, $template);

       $resp = mail($email, $subjectInc, $template, $headers);
       return $resp;
   }
}