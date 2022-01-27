<?php

use PHPMailer\PHPMailer\PHPMailer;

require_once 'mail.php';

$postData = $_POST;

/** @var PHPMailer $mail */

// Кому
$mail->addAddress('email@example.com', 'masd.games');
// Тема письма
$mail->Subject = 'Обсуждение проекта/Связь с менеджером';
// Тело письма
$body = "
<p><strong>Имя:</strong> {$postData['userName']}</p>
<p><strong>Email:</strong> {$postData['userEmail']}</p>
<p><strong>Сообщение</strong> {$postData['userMessage']}</p>
";
$mail->msgHTML($body);
$mail->send();

if ($mail->isError()) {
	throw new Exception($mail->ErrorInfo);
}