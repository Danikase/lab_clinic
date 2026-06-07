<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            color: #000;
            margin: 0;
            padding: 30px 40px;
            position: relative;
        }

        /* Encabezado de 3 columnas */
        .header-table {
            width: 100%;
            margin-bottom: 8px;
            color: #1e3a8a;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 10px;
        }

        .header-table td {
            vertical-align: top;
            padding: 2px;
        }

        .lab-title {
            font-family: 'Times New Roman', Times, serif;
            font-size: 15px;
            font-weight: bold;
            text-align: center;
            margin: 0;
            text-transform: uppercase;
            color: #1e3a8a;
        }

        .lab-sub {
            font-family: 'Times New Roman', Times, serif;
            font-size: 17px;
            font-weight: bold;
            text-align: center;
            margin: 2px 0 4px;
            color: #1e3a8a;
        }

        .license-text {
            font-family: 'Times New Roman', Times, serif;
            font-size: 10px;
            text-align: center;
            font-style: italic;
            margin-top: 4px;
            color: #1e3a8a;
        }

        .schedule-text,
        .address-text {
            font-family: 'Times New Roman', Times, serif;
            font-size: 8px;
            line-height: 1.3;
            color: #1e3a8a;
        }

        .schedule-text {
            text-align: right;
        }

        .address-text {
            text-align: left;
        }

        /* Datos del paciente con líneas inferiores */
        .patient-table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .patient-table td {
            padding: 4px 2px;
            font-family: 'Times New Roman', Times, serif;
            font-size: 11px;
            color: #1e3a8a;
            vertical-align: bottom;
        }

        .patient-line {
            border-bottom: 1px solid #1e3a8a;
            width: 100%;
            display: inline-block;
            min-height: 14px;
        }

        /* Título del examen */
        .exam-main-title {
            font-family: 'Times New Roman', Times, serif;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 13px;
            margin: 15px 0 10px;
            text-align: center;
            color: #1e3a8a;
            text-decoration: underline;
        }

        /* Secciones */
        .section-title {
            font-family: 'Times New Roman', Times, serif;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
            margin: 15px 0 8px;
            padding: 3px 5px;
            background-color: #1e3a8a;
            color: #fff;
            border: 1px solid #1e3a8a;
        }

        /* Tablas de resultados */
        .result-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            font-size: 10px;
        }

        .result-table td {
            border: 1px solid #1e3a8a;
            padding: 4px 6px;
            vertical-align: top;
        }

        .result-table td:first-child {
            font-weight: bold;
            width: 35%;
            color: #1e3a8a;
            font-family: 'Times New Roman', Times, serif;
        }

        .result-table td:nth-child(2) {
            width: 30%;
            text-align: center;
        }

        .result-table td:nth-child(3) {
            width: 35%;
        }

        /* Tabla de 2 columnas para microscópico */
        .micro-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .micro-table td {
            border: 1px solid #1e3a8a;
            padding: 3px 5px;
            font-size: 9px;
            vertical-align: top;
        }

        .micro-table .label {
            font-weight: bold;
            color: #1e3a8a;
            font-family: 'Times New Roman', Times, serif;
            width: 40%;
        }

        .micro-table .value {
            width: 30%;
            text-align: center;
        }

        .micro-table .ref {
            width: 30%;
            font-style: italic;
            color: #555;
        }

        /* Observaciones */
        .observations {
            margin-top: 15px;
            border: 1px solid #1e3a8a;
            padding: 8px;
            min-height: 50px;
            font-size: 10px;
        }

        .observations-title {
            font-weight: bold;
            color: #1e3a8a;
            font-family: 'Times New Roman', Times, serif;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        /* Firma */
        .footer {
            margin-top: 40px;
            text-align: center;
            font-family: 'Times New Roman', Times, serif;
            color: #1e3a8a;
        }

        .sign-line {
            width: 220px;
            border-top: 1px solid #1e3a8a;
            margin: 0 auto 5px;
        }

        .sign-name {
            font-weight: bold;
            font-size: 10px;
        }

        .sign-license {
            font-size: 9px;
        }

        /* Marca de agua */
        .watermark {
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 280px;
            opacity: 0.12;
            z-index: 0;
            pointer-events: none;
        }
    </style>
</head>

<body>
    <!-- LOGO / MARCA DE AGUA -->
    @if($logo)
    <img src="{{ $logo }}" class="watermark" alt="Logo Laboratorio Alfaro">
    @endif

    <!-- ENCABEZADO 3 COLUMNAS -->
    <table class="header-table">
        <tr>
            <!-- Izquierda: Dirección -->
            <td width="30%" class="address-text">
                <strong>DIRECCIÓN</strong><br>
                1° Avenida Norte # 11 – B<br>
                Barrio Las Ánimas, Chalchuapa
            </td>

            <!-- Centro: Título y Licencias -->
            <td width="40%">
                <h1 class="lab-title">LABORATORIO DE ANÁLISIS CLÍNICO</h1>
                <h2 class="lab-sub">"ALFARO"</h2>
                <div style="text-align: center; font-weight: bold; font-size: 11px; color: #1e3a8a;">C.S.S.P. N° 839</div>
                <div class="license-text">Lic. Luis Alejandro Alfaro &nbsp; J.V.P.L.C.1137</div>
            </td>

            <!-- Derecha: Horario -->
            <td width="30%" class="schedule-text">
                <strong>HORARIO</strong><br>
                Lunes a Viernes<br>
                7:00 a.m. a 12:00 m.<br>
                2:00 p.m. a 4:00 p.m.<br>
                Sábado: 7:00 a.m. – 12:00 m
            </td>
        </tr>
    </table>

    <!-- DATOS DEL PACIENTE -->
    <table class="patient-table">
        <tr>
            <td width="15%"><strong>Paciente:</strong></td>
            <td colspan="5" style="border-bottom: 1px solid #1e3a8a; padding-left: 8px;">
                {{ $order->patient->first_name }} {{ $order->patient->last_name }}
            </td>
        </tr>
        <tr>
            <td><strong>Edad:</strong></td>
            <td style="border-bottom: 1px solid #1e3a8a; padding-left: 8px;">{{ $ageText }}</td>
            <td width="10%"><strong>Sexo:</strong></td>
            <td width="10%" style="border-bottom: 1px solid #1e3a8a; text-align: center;">
                @php
                $gender = strtoupper($order->patient->gender ?? 'O');
                $displayGender = ($gender === 'M') ? 'M' : (($gender === 'F') ? 'F' : '-');
                @endphp
                {{ $displayGender }}
            </td>
            <td width="12%"><strong>Fecha:</strong></td>
            <td style="border-bottom: 1px solid #1e3a8a; padding-left: 8px;">{{ $date }}</td>
        </tr>
    </table>

    <!-- TÍTULO PRINCIPAL -->
    <div class="exam-main-title">EXAMEN GENERAL DE HECES</div>

    <!-- EXAMEN MACROSCÓPICO -->
    <div class="section-title">EXAMEN MACROSCÓPICO</div>
    <table class="result-table">
        @php
        $macroFields = ['COLOR', 'CONSISTENCIA', 'MUCUS'];
        @endphp

        @foreach($reportData as $item)
        @if(in_array(strtoupper($item['name']), $macroFields))
        <tr>
            <td>{{ strtoupper($item['name']) }}</td>
            <td>{{ $item['value'] }}</td>
            <td>{{ $item['unit'] }}</td>
        </tr>
        @endif
        @endforeach
    </table>

    <!-- EXAMEN MICROSCÓPICO -->
    <div class="section-title">EXAMEN MICROSCÓPICO</div>
    <table class="micro-table">
        <tr>
            <td class="label">PROTOZOARIOS ACTIVOS</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'PROTOZOARIOS ACTIVOS');
                echo $field ? $field['value'] : 'NO SE OBSERVAN';
                @endphp
            </td>
            <td class="ref">NO SE OBSERVAN</td>
        </tr>
        <tr>
            <td class="label">PROTOZOARIOS QUISTES</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'PROTOZOARIOS QUISTES');
                echo $field ? $field['value'] : 'NO SE OBSERVAN';
                @endphp
            </td>
            <td class="ref">NO SE OBSERVAN</td>
        </tr>
        <tr>
            <td class="label">METAZOARIOS LARVAS</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'METAZOARIOS LARVAS');
                echo $field ? $field['value'] : 'NO SE OBSERVAN';
                @endphp
            </td>
            <td class="ref">NO SE OBSERVAN</td>
        </tr>
        <tr>
            <td class="label">METAZOARIOS HUEVOS</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'METAZOARIOS HUEVOS');
                echo $field ? $field['value'] : 'NO SE OBSERVAN';
                @endphp
            </td>
            <td class="ref">NO SE OBSERVAN</td>
        </tr>
        <tr>
            <td class="label">OTROS</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'OTROS');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td class="ref"></td>
        </tr>
        <tr>
            <td class="label">DETRITUS MACROSCÓPICOS</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'DETRITUS MACROSCÓPICOS');
                echo $field ? $field['value'] : 'MODERADOS';
                @endphp
            </td>
            <td class="ref">MODERADOS</td>
        </tr>
        <tr>
            <td class="label">DETRITUS MICROSCÓPICOS</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'DETRITUS MICROSCÓPICOS');
                echo $field ? $field['value'] : 'MODERADOS';
                @endphp
            </td>
            <td class="ref">MODERADOS</td>
        </tr>
        <tr>
            <td class="label">LEUCOCITOS</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'LEUCOCITOS');
                echo $field ? $field['value'] : 'X/C';
                @endphp
            </td>
            <td class="ref">X/C</td>
        </tr>
        <tr>
            <td class="label">HEMATÍES</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'HEMATIES');
                echo $field ? $field['value'] : 'X/C';
                @endphp
            </td>
            <td class="ref">X/C</td>
        </tr>
        <tr>
            <td class="label">SANGRE OCULTA</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'SANGRE OCULTA');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td class="ref"></td>
        </tr>
        <tr>
            <td class="label">P.A.M.</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'P.A.M.');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td class="ref"></td>
        </tr>
        <tr>
            <td class="label">POLIMORFONUCLEARES</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'POLIMORFONUCLEARES');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td class="ref">%</td>
        </tr>
        <tr>
            <td class="label">MONONUCLEARES</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'MONONUCLEARES');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td class="ref">%</td>
        </tr>
        <tr>
            <td class="label">CONCENTRADO</td>
            <td class="value">
                @php
                $field = $reportData->firstWhere('name', 'CONCENTRADO');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td class="ref"></td>
        </tr>
    </table>

    <!-- OBSERVACIONES -->
    @php
    $observations = $reportData->firstWhere('name', 'OBSERVACIONES');
    @endphp
    @if($observations && $observations['value'])
    <div class="observations">
        <div class="observations-title">OBSERVACIONES:</div>
        <div>{{ $observations['value'] }}</div>
    </div>
    @endif

    <!-- FIRMA -->
    <div class="footer">
        <br><br>
        <div class="sign-line"></div>
        <div class="sign-name">Lic. Luis Alejandro Alfaro</div>
        <div class="sign-license">C.S.S.P. N° 839</div>
    </div>
</body>

</html>