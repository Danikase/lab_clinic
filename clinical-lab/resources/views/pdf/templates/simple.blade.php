<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
            margin: 0;
            padding: 30px 40px;
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
            line-height: 1.3;
        }

        .lab-name {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0;
        }

        .lab-sub {
            font-size: 16px;
            font-weight: bold;
            margin: 5px 0 10px;
        }

        .watermark {
            position: absolute;
            top: 45%;
            /* Centrado vertical (un poco más abajo del centro) */
            left: 50%;
            /* Centrado horizontal */
            transform: translate(-50%, -50%);
            width: 280px;
            /* Tamaño ajustado para que no tape el texto */
            opacity: 0.4;
            /* Muy transparente para que el texto se lea bien */
            z-index: 0;
            /* Se queda al fondo */
            pointer-events: none;
            /* No interfiere con clicks */
        }

        .lab-info {
            font-size: 9px;
            margin: 2px 0;
            line-height: 1.4;
        }

        .license {
            font-size: 10px;
            font-weight: bold;
            margin-top: 10px;
        }

        /* Datos del paciente */
        .patient-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        .patient-table td {
            padding: 3px 5px;
            border-bottom: 1px solid #000;
            font-size: 11px;
        }

        .label {
            font-weight: bold;
            width: 120px;
        }

        /* Sección de examen */
        .exam-section {
            margin-top: 20px;
            border-top: 2px solid #000;
            padding-top: 10px;
        }

        .exam-title {
            font-weight: bold;
            margin-bottom: 15px;
            text-transform: uppercase;
            font-size: 12px;
        }

        .result-label {
            font-weight: bold;
            margin-top: 15px;
            text-transform: uppercase;
        }

        .result-value {
            font-size: 14px;
            font-weight: bold;
            margin: 5px 0;
        }

        /* Referencias */
        .references-box {
            margin-top: 25px;
            border: 1px solid #999;
            padding: 10px;
            background-color: #f9f9f9;
        }

        .ref-title {
            text-align: center;
            font-weight: bold;
            margin-bottom: 8px;
            text-transform: uppercase;
            font-size: 10px;
        }

        .ref-row {
            font-size: 10px;
            margin-bottom: 4px;
            line-height: 1.5;
        }

        /* Firma */
        .footer {
            margin-top: 40px;
            text-align: center;
        }

        .sign-line {
            width: 220px;
            border-top: 1px solid #000;
            margin: 0 auto 5px;
        }
    </style>
</head>

<body>
    <!-- LOGO COMO IMAGEN BASE64 -->
    @if($logo)
    <img src="{{ $logo }}" class="logo-header" alt="Logo Laboratorio Alfaro">
    @endif

    <!-- ENCABEZADO -->
    <div class="header">
        <div class="lab-name">LABORATORIO DE ANÁLISIS CLÍNICO</div>
        <div class="lab-sub">"ALFARO"</div>
        <div class="lab-info">
            Dirección: 1° Avenida Norte # 11 – B Barrio Las Ánimas, Chalchuapa<br>
            Horario: Lunes a Viernes 7:00 a.m. a 12:00 m. y 2:00 p.m. a 4:00 p.m.<br>
            Sábado: 7:00 a.m. – 12:00 m.
        </div>
        <div class="license">C.S.S.P. N° 839 &nbsp;&nbsp; Lic. Luis Alejandro Alfaro &nbsp;&nbsp; J.V.P.L.C.1137</div>
    </div>

    <!-- DATOS DEL PACIENTE -->
    <table class="patient-table">
        <tr>
            <td class="label">Paciente:</td>
            <td colspan="3">{{ $order->patient->first_name }} {{ $order->patient->last_name }}</td>
        </tr>
        <tr>
            <td class="label">Edad:</td>
            <td>{{ $ageText }}</td>
            <td class="label">Sexo:</td>
            <td>{{ strtoupper(substr($order->patient->gender, 0, 1)) }}</td>
            <td class="label">Fecha:</td>
            <td>{{ $date }}</td>
        </tr>
        <tr>
            <td class="label">Muestra de:</td>
            <td colspan="5"><strong>{{ strtoupper($order->sample_type ?? 'SANGRE') }}</strong></td>
        </tr>
    </table>

    <!-- EXAMEN Y RESULTADO -->
    <div class="exam-section">
        <div class="exam-title">Examen realizado: {{ strtoupper($order->exam->name) }}</div>

        <div class="result-label">Resultado</div>
        @foreach($reportData as $item)
        <div class="result-value">
            {{ $item['value'] }} {{ $item['unit'] }}
        </div>
        @endforeach
    </div>

    <!-- FIRMA -->
    <div class="footer">
        <br><br><br>
        <div class="sign-line"></div>
        <div style="font-weight: bold;">Licenciado Luis Alejandro Alfaro</div>
    </div>
</body>

</html>