<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: sans-serif;
            color: #333;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #0ea5e9;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        .header h1 {
            color: #0ea5e9;
            margin: 0;
            font-size: 24px;
        }

        .info-grid {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }

        th {
            background: #f3f4f6;
            text-align: left;
            padding: 8px;
            border: 1px solid #ddd;
        }

        td {
            padding: 8px;
            border: 1px solid #ddd;
        }

        .status-normal {
            color: green;
            font-weight: bold;
        }

        .status-low {
            color: #d97706;
            font-weight: bold;
        }

        .status-high {
            color: #dc2626;
            font-weight: bold;
        }

        .footer {
            text-align: center;
            font-size: 10px;
            color: #888;
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>LABORATORIO CLÍNICO</h1>
        <p>Reporte de Resultados de Laboratorio</p>
    </div>

    <div class="info-grid">
        <div>
            <strong>Paciente:</strong> {{ $order->patient->first_name }} {{ $order->patient->last_name }}<br>
            <strong>DUI:</strong> {{ $order->patient->dui }}
        </div>
        <div style="text-align: right;">
            <strong>Examen:</strong> {{ $order->exam->name }}<br>
            <strong>Fecha:</strong> {{ $date }}
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Parámetro</th>
                <th>Resultado</th>
                <th>Unidad</th>
                <th>Rango Ref.</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reportData as $row)
            <tr>
                <td>{{ $row['name'] }}</td>
                <td><strong>{{ $row['value'] }}</strong></td>
                <td>{{ $row['unit'] }}</td>
                <td>{{ $row['ref_range'] }}</td>
                <td>
                    @if($row['status'] == 'normal') <span class="status-normal">Normal</span>
                    @elseif($row['status'] == 'low') <span class="status-low">Bajo</span>
                    @elseif($row['status'] == 'high') <span class="status-high">Alto</span>
                    @else N/A @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Este documento ha sido generado digitalmente por el Sistema de Gestión de Laboratorio.
    </div>
</body>

</html>