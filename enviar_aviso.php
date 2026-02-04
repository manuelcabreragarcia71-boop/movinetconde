<?php
// enviar_aviso.php

// Verificamos si la solicitud viene por POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Recogemos los datos y los limpiamos un poco
    $nombre = isset($_POST['nombre']) ? strip_tags($_POST['nombre']) : 'Sin nombre';
    $telefono = isset($_POST['telefono']) ? strip_tags($_POST['telefono']) : 'Sin teléfono';
    $interes = isset($_POST['interes']) ? strip_tags($_POST['interes']) : 'General';
    $tipo = isset($_POST['tipo_envio']) ? $_POST['tipo_envio'] : 'manual';

    // CONFIGURACIÓN DEL CORREO
    // --------------------------------------------------
    $para = "manucg618@gmail.com"; // <--- PON AQUÍ TU EMAIL
    $asunto = "Nuevo Cliente Potencial (Movinet): $nombre";
    
    // Contenido del mensaje
    $mensaje = "Hola,\n\n";
    $mensaje .= "Un cliente ha introducido sus datos en la web:\n\n";
    $mensaje .= "Nombre: " . $nombre . "\n";
    $mensaje .= "Teléfono: " . $telefono . "\n";
    $mensaje .= "Interesado en: " . $interes . "\n";
    
    if ($tipo == 'automatico') {
        $mensaje .= "\n(NOTA: Este aviso se envió automáticamente al detectar el número, el cliente quizás no ha dado a 'Enviar' todavía).";
    }

    $cabeceras = "From: web@movinet.com"; // Pon un correo de tu dominio
    
    // Enviar el correo
    mail($para, $asunto, $mensaje, $cabeceras);
    
    // Responder al JavaScript que todo fue bien
    echo "Correo enviado";
}
?>
