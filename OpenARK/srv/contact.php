<?php
include('./models/ContactModel.php');

use \models\ContactModel;

if ($_SERVER['REQUEST_METHOD'] == 'POST' &&  !empty($_POST['ContactForm'])) {
    $model = new ContactModel($_POST['ContactForm']);

    header('Content-Type: application/json');
    if($model->isValid()) {
        // Email message, change it whatever you wish
        $subject = "[Your App] Contact Form - {$model->subject}";

        // Your e-mail address here.
        // This is where you're going to receive messages sent through the page
        $to = 'your@email.here';

        // From
        $headers = "From: {$model->email}";

        // Body
        $body = "\nName: {$model->fullName}\nEmail: {$model->email}\nSubject:{$model->subject}\n\n\n{$model->message}";

        // Send mail
        // mail($to, $subject, $body, $headers);

        // Results
        echo json_encode([
            "result" => true,
            "message" => "Thank you for contact us."
        ]);
    } else {
        echo json_encode([
            "result" => false,
            "message" => "We've found some errors.",
            "errors" => $model->errors
        ]);
    }
}
