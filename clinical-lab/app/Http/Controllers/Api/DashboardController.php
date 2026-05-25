<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\LabOrder;
use App\Models\Exam;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Retorna estadísticas completas para el Dashboard
     * Incluye KPIs operativos, tendencias históricas y métricas financieras
     */
    public function stats(): JsonResponse
    {
        // 1️⃣ KPIs Operativos Básicos
        $totalPatients   = Patient::count();
        $totalOrders     = LabOrder::count();
        $completedOrders = LabOrder::where('status', 'completed')->count();
        $pendingOrders   = LabOrder::where('status', 'in_progress')->count();
        $activeExams     = Exam::where('is_active', true)->count();

        // 💰 Ingresos del mes actual (solo órdenes completadas)
        $startOfMonth    = now()->startOfMonth();
        $monthlyIncome   = LabOrder::where('status', 'completed')
            ->where('created_at', '>=', $startOfMonth)
            ->sum('unit_price');

        // 2️⃣ Gráfica de Líneas: Órdenes por mes (últimos 6 meses)
        $ordersByMonth = LabOrder::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('count(*) as total')
        )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->map(fn($item) => [
                'name'    => date('M', strtotime($item->month)),
                'ordenes' => $item->total
            ]);

        // 3️⃣ Gráfica de Pastel: Exámenes más solicitados (Top 5)
        $topExams = LabOrder::with('exam')
            ->select('exam_id', DB::raw('count(*) as total'))
            ->groupBy('exam_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'name'     => $item->exam ? $item->exam->name : 'Desconocido',
                'cantidad' => $item->total
            ]);

        // 4️⃣ Gráfica Financiera: Ingresos por mes (últimos 6 meses)
        $incomeByMonth = LabOrder::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('SUM(unit_price) as total')
        )
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->map(fn($item) => [
                'name'     => date('M', strtotime($item->month)),
                'ingresos' => floatval($item->total)
            ]);

        // 5️⃣ Gráfica Financiera: Top exámenes por ingresos generados
        $topRevenueExams = LabOrder::with('exam')
            ->select('exam_id', DB::raw('SUM(unit_price) as total'))
            ->where('status', 'completed')
            ->groupBy('exam_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'name'     => $item->exam ? $item->exam->name : 'Desconocido',
                'ingresos' => floatval($item->total)
            ]);

        // 6️⃣ Citas Programadas para HOY
        $todayAppointments = Appointment::with('patient')
            ->whereDate('appointment_date', today())
            ->whereIn('status', ['scheduled', 'completed'])
            ->orderBy('appointment_date', 'asc')
            ->get()
            ->map(fn($apt) => [
                'id'      => $apt->id,
                'time'    => $apt->appointment_date->format('H:i'),
                'patient' => $apt->patient->first_name . ' ' . $apt->patient->last_name,
                'type'    => $apt->type,
                'status'  => $apt->status,
            ]);

        // 📦 Respuesta unificada
        return response()->json([
            'kpis' => [
                'patients'       => $totalPatients,
                'orders'         => $totalOrders,
                'completed'      => $completedOrders,
                'pending'        => $pendingOrders,
                'active_exams'   => $activeExams,
                'monthly_income' => floatval($monthlyIncome),
            ],
            'charts' => [
                'orders_by_month'     => $ordersByMonth,
                'top_exams'           => $topExams,
                'income_by_month'     => $incomeByMonth,
                'top_revenue_exams'   => $topRevenueExams,
            ],
            'today_appointments' => $todayAppointments
        ]);
    }
}
