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

        /* Título principal */
        .exam-main-title {
            font-family: 'Times New Roman', Times, serif;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 13px;
            margin: 15px 0 15px;
            text-align: center;
            color: #1e3a8a;
            text-decoration: underline;
        }

        /* Tabla principal de resultados (2 columnas) */
        .results-container {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .results-container td {
            border: 1px solid #1e3a8a;
            padding: 4px 6px;
            vertical-align: top;
            font-size: 10px;
        }

        .results-container td:first-child {
            font-weight: bold;
            width: 35%;
            color: #1e3a8a;
            font-family: 'Times New Roman', Times, serif;
        }

        .results-container td:nth-child(2) {
            width: 20%;
            text-align: center;
            font-weight: bold;
        }

        .results-container td:nth-child(3) {
            width: 15%;
            text-align: center;
            font-style: italic;
            color: #555;
        }

        .results-container td:nth-child(4) {
            width: 30%;
            font-weight: bold;
            color: #1e3a8a;
            font-family: 'Times New Roman', Times, serif;
        }

        .results-container td:nth-child(5) {
            width: 20%;
            text-align: center;
            font-weight: bold;
        }

        .results-container td:last-child {
            width: 15%;
            text-align: center;
            font-style: italic;
            color: #555;
        }

        /* Sección de líneas de análisis */
        .analysis-section {
            margin-top: 20px;
            margin-bottom: 20px;
        }

        .line-title {
            font-family: 'Times New Roman', Times, serif;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 5px;
        }

        .line-content {
            padding: 8px;
            border: 1px solid #1e3a8a;
            min-height: 40px;
            font-size: 10px;
            line-height: 1.4;
        }

        /* Observaciones adicionales */
        .additional-obs {
            margin-top: 15px;
            padding: 8px;
            border: 1px solid #1e3a8a;
            font-size: 10px;
            background-color: #f0f4f8;
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
    </table>

    <!-- TÍTULO PRINCIPAL -->
    <div class="exam-main-title">FROTIS DE SANGRE PERIFÉRICA</div>

    <!-- TABLA DE RESULTADOS -->
    <table class="results-container">
        <tr>
            <td>HEMATOCRITO</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'HEMATOCRITO');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>%</td>
            <td>T. DE SANGRAMIENTO</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'T. DE SANGRAMIENTO');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>Min/seg</td>
        </tr>
        <tr>
            <td>HEMOGLOBINA</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'HEMOGLOBINA');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>g/dl</td>
            <td>T. DE COAGULACIÓN</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'T. DE COAGULACIÓN');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>Minutos</td>
        </tr>
        <tr>
            <td>GLOBULOS ROJOS</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'GLOBULOS ROJOS');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>Mm³</td>
            <td>V. E. S. G.</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'V. E. S. G.');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>mm/hora</td>
        </tr>
        <tr>
            <td>GLOBULOS BLANCOS</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'GLOBULOS BLANCOS');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>Mm³</td>
            <td>H. C. M.</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'H. C. M.');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>Pg</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="5" style="text-align: center; font-weight: bold; background-color: #1e3a8a; color: white;">
                VALORES ABSOLUTOS G. B. ( )
            </td>
        </tr>
        <tr>
            <td>LINFOCITOS</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'LINFOCITOS');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>%</td>
            <td>C. H. C. M.</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'C. H. C. M.');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>g/dl</td>
        </tr>
        <tr>
            <td>NEUTROFILOS</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'NEUTROFILOS');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>%</td>
            <td>V. C. M.</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'V. C. M.');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>fl</td>
        </tr>
        <tr>
            <td>EOSINOFILOS</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'EOSINOFILOS');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>%</td>
            <td>RETICULOCITOS</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'RETICULOCITOS');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>%</td>
        </tr>
        <tr>
            <td>BASOFILOS</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'BASOFILOS');
                echo $field ? $field['value'] : '--';
                @endphp
            </td>
            <td>%</td>
            <td>GOTA GRUESA</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'GOTA GRUESA');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td></td>
        </tr>
        <tr>
            <td>MONOCITOS</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'MONOCITOS');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>%</td>
            <td>PLAQUETAS</td>
            <td>
                @php
                $field = $reportData->firstWhere('name', 'PLAQUETAS');
                echo $field ? $field['value'] : '';
                @endphp
            </td>
            <td>Mm³</td>
        </tr>
    </table>

    <!-- SECCIONES DE ANÁLISIS -->
    <div class="analysis-section">
        <div class="line-title">LÍNEA ROJA:</div>
        <div class="line-content">
            @php
            $field = $reportData->firstWhere('name', 'LINEA ROJA');
            echo $field ? $field['value'] : '';
            @endphp
        </div>
    </div>

    <div class="analysis-section">
        <div class="line-title">LÍNEA BLANCA:</div>
        <div class="line-content">
            @php
            $field = $reportData->firstWhere('name', 'LINEA BLANCA');
            echo $field ? $field['value'] : '';
            @endphp
        </div>
    </div>

    <div class="analysis-section">
        <div class="line-title">PLAQUETAS:</div>
        <div class="line-content">
            @php
            $field = $reportData->firstWhere('name', 'PLAQUETAS ANALISIS');
            echo $field ? $field['value'] : '';
            @endphp
        </div>
    </div>

    <!-- OBSERVACIONES ADICIONALES -->
    @php
    $creatinina = $reportData->firstWhere('name', 'CREATININA SERICA');
    @endphp
    @if($creatinina && $creatinina['value'])
    <div class="additional-obs">
        CREATININA SERICA: {{ $creatinina['value'] }} mg/dl
        @if($creatinina['ref_min'] || $creatinina['ref_max'])
        VN: {{ $creatinina['ref_min'] ?? '0.5' }} a {{ $creatinina['ref_max'] ?? '1.5' }} mg/dl
        @endif
    </div>
    @endif

    <!-- FIRMA -->
    <div class="footer">
        <br>
        <div class="sign-line"></div>
        <div class="sign-name">RESPONSABLE</div>
    </div>
</body>

</html>