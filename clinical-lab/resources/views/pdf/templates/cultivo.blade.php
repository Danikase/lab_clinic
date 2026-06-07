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

        /* Caja de aislamiento */
        .isolation-box {
            border: 1px solid #1e3a8a;
            padding: 8px;
            margin: 15px 0;
            font-weight: bold;
            font-size: 11px;
            text-align: center;
            background-color: #f0f4f8;
            color: #1e3a8a;
        }

        /* Tabla de antibiograma */
        .ast-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .ast-table th {
            background-color: #1e3a8a;
            color: #fff;
            padding: 6px;
            font-size: 10px;
            text-transform: uppercase;
            font-family: 'Times New Roman', Times, serif;
        }

        .ast-table td {
            border: 1px solid #1e3a8a;
            padding: 6px;
            vertical-align: top;
            font-size: 10px;
            line-height: 1.5;
        }

        .ast-list {
            margin: 0;
            padding-left: 15px;
        }

        .ast-list li {
            margin-bottom: 2px;
        }

        /* Firma */
        .footer {
            margin-top: 40px;
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
    <div class="exam-main-title">CULTIVO Y ANTIBIOGRAMA DE ORINA</div>

    <!-- RESULTADO DE AISLAMIENTO -->
    @php
    $aislamiento = $reportData->firstWhere('name', 'AISLAMIENTO') ?? $reportData->firstWhere('name', 'RESULTADO');
    $sensibles = $reportData->firstWhere('name', 'SENSIBLE');
    $intermedios = $reportData->firstWhere('name', 'INTERMEDIO');
    $resistentes = $reportData->firstWhere('name', 'RESISTENTE');
    @endphp

    @if($aislamiento && $aislamiento['value'])
    <div class="isolation-box">
        {{ strtoupper($aislamiento['value']) }}
    </div>
    @endif

    <!-- TABLA DE ANTIBIOGRAMA -->
    <table class="ast-table">
        <thead>
            <tr>
                <th style="width: 33%;">SENSIBLE</th>
                <th style="width: 34%;">INTERMEDIO</th>
                <th style="width: 33%;">RESISTENTE</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    @if($sensibles && $sensibles['value'])
                    <ul class="ast-list">
                        @foreach(explode(',', $sensibles['value']) as $antibiotico)
                        @if(trim($antibiotico))
                        <li>{{ trim(ucwords(strtolower($antibiotico))) }}</li>
                        @endif
                        @endforeach
                    </ul>
                    @else
                    <span style="color: #999; font-style: italic;">No reportado</span>
                    @endif
                </td>
                <td>
                    @if($intermedios && $intermedios['value'])
                    <ul class="ast-list">
                        @foreach(explode(',', $intermedios['value']) as $antibiotico)
                        @if(trim($antibiotico))
                        <li>{{ trim(ucwords(strtolower($antibiotico))) }}</li>
                        @endif
                        @endforeach
                    </ul>
                    @else
                    <span style="color: #999; font-style: italic;">No reportado</span>
                    @endif
                </td>
                <td>
                    @if($resistentes && $resistentes['value'])
                    <ul class="ast-list">
                        @foreach(explode(',', $resistentes['value']) as $antibiotico)
                        @if(trim($antibiotico))
                        <li>{{ trim(ucwords(strtolower($antibiotico))) }}</li>
                        @endif
                        @endforeach
                    </ul>
                    @else
                    <span style="color: #999; font-style: italic;">No reportado</span>
                    @endif
                </td>
            </tr>
        </tbody>
    </table>

    <!-- FIRMA -->
    <div class="footer">
        <br><br>
        <div class="sign-line"></div>
        <div class="sign-name">RESPONSABLE</div>
    </div>
</body>

</html>