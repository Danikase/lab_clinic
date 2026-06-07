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

        /* Datos del paciente */
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

        /* Título principal */
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

        /* ESTILO DE LA TABLA PRINCIPAL (Física/Química/Micro) */
        .main-results-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #1e3a8a;
            margin-top: 10px;
            font-size: 10px;
        }

        .main-results-table td {
            border: 1px solid #1e3a8a;
            padding: 5px 8px;
            vertical-align: middle;
        }

        /* Encabezados de sección */
        .section-header {
            background-color: #ffffff;
            /* Fondo blanco como en la imagen */
            color: #1e3a8a;
            font-weight: bold;
            text-transform: uppercase;
            text-align: center;
            font-size: 11px;
            font-family: 'Times New Roman', Times, serif;
            border-bottom: 2px solid #1e3a8a;
        }

        /* Filas de datos */
        .data-label {
            font-weight: bold;
            color: #1e3a8a;
            /* Azul para las etiquetas (Color, Aspecto, etc) */
            font-family: 'Times New Roman', Times, serif;
            width: 18%;
            text-transform: uppercase;
        }

        .data-value {
            width: 22%;
            color: #000;
        }

        /* Subtítulo químico */
        .quimico-header {
            background-color: #1e3a8a;
            color: white;
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10px;
        }

        /* Observaciones */
        .observations {
            margin-top: 15px;
            font-size: 10px;
        }

        .observations-title {
            font-weight: bold;
            color: #1e3a8a;
            font-family: 'Times New Roman', Times, serif;
            margin-bottom: 3px;
            text-transform: uppercase;
        }

        /* Firma */
        .footer {
            margin-top: 30px;
            text-align: right;
            font-family: 'Times New Roman', Times, serif;
            color: #1e3a8a;
        }

        .sign-line {
            width: 200px;
            border-top: 1px solid #1e3a8a;
            margin: 0 0 5px auto;
        }

        .sign-name {
            font-weight: bold;
            font-size: 10px;
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
        <tr>
            <td><strong>Muestra de:</strong></td>
            <td colspan="5" style="border-bottom: 1px solid #1e3a8a; padding-left: 8px;">
                <strong>{{ strtoupper($order->sample_type ?? 'ORINA') }}</strong>
            </td>
        </tr>
    </table>

    <!-- TÍTULO PRINCIPAL -->
    <div class="exam-main-title">EXAMEN GENERAL DE ORINA</div>

    <!-- TABLA PRINCIPAL -->
    <table class="main-results-table">
        <!-- FILA 1: ENCABEZADOS -->
        <tr>
            <td colspan="2" class="section-header" style="border-bottom: 2px solid #1e3a8a;">ANÁLISIS FÍSICO</td>
            <td colspan="2" class="section-header" style="border-bottom: 2px solid #1e3a8a;">ANÁLISIS MICROSCÓPICO</td>
        </tr>

        <!-- FILA 2 -->
        <tr>
            <td class="data-label">COLOR:</td>
            <td class="data-value">
                @php $f = $reportData->firstWhere('name', 'COLOR'); @endphp
                {{ $f['value'] ?? '' }}
            </td>
            <td class="data-label">LEUCOCITOS:</td>
            <td class="data-value">
                @php $f = $reportData->firstWhere('name', 'LEUCOCITOS'); @endphp
                {{ $f['value'] ?? '' }} XC
            </td>
        </tr>

        <!-- FILA 3 -->
        <tr>
            <td class="data-label">ASPECTO:</td>
            <td class="data-value">
                @php $f = $reportData->firstWhere('name', 'ASPECTO'); @endphp
                {{ $f['value'] ?? '' }}
            </td>
            <td class="data-label">HEMATÍES:</td>
            <td class="data-value">
                @php $f = $reportData->firstWhere('name', 'HEMATIES'); @endphp
                {{ $f['value'] ?? '' }} XC
            </td>
        </tr>

        <!-- FILA 4 -->
        <tr>
            <td class="data-label">PH:</td>
            <td class="data-value">
                @php $f = $reportData->firstWhere('name', 'PH'); @endphp
                {{ $f['value'] ?? '' }}
            </td>
            <td class="data-label">CÉL. EPITELIALES:</td>
            <td class="data-value">
                @php $f = $reportData->firstWhere('name', 'CELULAS EPITELIALES'); @endphp
                {{ $f['value'] ?? '' }}
            </td>
        </tr>

        <!-- FILA 5 -->
        <tr>
            <td class="data-label">DENSIDAD:</td>
            <td class="data-value">
                @php $f = $reportData->firstWhere('name', 'DENSIDAD'); @endphp
                {{ $f['value'] ?? '' }}
            </td>
            <td class="data-label">CILINDROS:</td>
            <td class="data-value">
                @php $f = $reportData->firstWhere('name', 'CILINDROS'); @endphp
                {{ $f['value'] ?? '' }}
            </td>
        </tr>

        <!-- FILA 6: Inicio de Químico (Izquierda) / Continuación Microscópico (Derecha) -->
        <tr>
            <td colspan="2" class="quimico-header" style="background-color: #1e3a8a; color: white;">ANÁLISIS QUÍMICO</td>
            <td class="data-label">CRISTALES:</td>
            <td class="data-value">
                @php $f = $reportData->firstWhere('name', 'CRISTALES'); @endphp
                {{ $f['value'] ?? '' }}
            </td>
        </tr>

        <!-- FILA 7: Datos Químicos (si existen) / Continuación Microscópico -->
        <tr>
            <td colspan="2" style="padding: 2px;">
                @php
                $quimicoParams = ['GLUCOSA', 'PROTEINAS', 'CETONAS', 'BILIRRUBINA', 'UROBILINOGENO', 'NITRITOS', 'SANGRE'];
                @endphp
                @foreach($quimicoParams as $param)
                @php $f = $reportData->firstWhere('name', strtoupper($param)); @endphp
                @if($f && $f['value'])
                <span style="font-weight:bold; color:#1e3a8a;">{{ strtoupper($param) }}:</span> {{ $f['value'] }}<br>
                @endif
                @endforeach
                <!-- Si no hay datos químicos, dejamos espacio o mensaje -->
                @if(!$reportData->whereIn('name', array_map('strtoupper', $quimicoParams))->isNotEmpty())
                <span style="color:#999; font-size: 9px;">(Sin datos químicos registrados)</span>
                @endif
            </td>
            <td class="data-label">BACTERIAS:</td>
            <td class="data-value">
                @php $f = $reportData->firstWhere('name', 'BACTERIAS'); @endphp
                {{ $f['value'] ?? '' }}
            </td>
        </tr>

        <!-- FILA 8 -->
        <tr>
            <!-- Celda vacía para equilibrar tabla o más datos químicos si es necesario -->
            <td colspan="2" style="background-color: #f9f9f9;"></td>
            <td class="data-label">PARÁSITOS:</td>
            <td class="data-value">
                @php $f = $reportData->firstWhere('name', 'PARASITOS'); @endphp
                {{ $f['value'] ?? '' }}
            </td>
        </tr>

        <!-- FILA 9 -->
        <tr>
            <td colspan="2" style="background-color: #f9f9f9;"></td>
            <td class="data-label">LEVADURAS:</td>
            <td class="data-value">
                @php $f = $reportData->firstWhere('name', 'LEVADURAS'); @endphp
                {{ $f['value'] ?? '' }}
            </td>
        </tr>

        <!-- FILA 10 -->
        <tr>
            <td colspan="2" style="background-color: #f9f9f9;"></td>
            <td class="data-label">OTROS:</td>
            <td class="data-value">
                @php $f = $reportData->firstWhere('name', 'OTROS'); @endphp
                {{ $f['value'] ?? '' }}
            </td>
        </tr>
    </table>

    <!-- OBSERVACIONES -->
    @php
    $obs = $reportData->firstWhere('name', 'OBSERVACIONES');
    @endphp
    @if($obs && $obs['value'])
    <div class="observations">
        <div class="observations-title">OBSERVACIONES:</div>
        <div>{{ $obs['value'] }}</div>
    </div>
    @endif

    <!-- FIRMA -->
    <div class="footer">
        <br><br>
        <div class="sign-line"></div>
        <div class="sign-name">RESPONSABLE</div>
    </div>
</body>

</html>