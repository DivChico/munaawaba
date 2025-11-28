"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createClient } from "@/lib/supabase/client";
import { Plus } from "lucide-react";
import { AppointmentModal } from "@/components/appointments/appointment-modal";
import { Toaster } from "sonner";

export default function CalendarPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchAppointments();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('appointments_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'appointments',
                },
                () => {
                    fetchAppointments();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchAppointments = async () => {
        try {
            // Fetch appointments with direct foreign key joins
            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    *,
                    customer:customers(name),
                    service:services(name_ar),
                    technician:profiles(id, full_name)
                `)
                .order('start_time', { ascending: true });

            if (error) {
                console.error('Error fetching appointments:', error);
                setEvents([]);
                setLoading(false);
                return;
            }

            // Transform to FullCalendar events
            const calendarEvents = data?.map((apt: any) => ({
                id: apt.id,
                title: `${apt.customer?.name || 'عميل'} - ${apt.service?.name_ar || 'خدمة'}`,
                start: apt.start_time,
                end: apt.end_time,
                backgroundColor: getEventColor(apt),
                borderColor: getEventColor(apt),
                extendedProps: {
                    ...apt,
                },
            })) || [];

            setEvents(calendarEvents);
        } catch (error: any) {
            console.error('Calendar data fetch error:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const getEventColor = (appointment: any) => {
        // Black = Holiday
        if (appointment.status === 'holiday') {
            return '#000000';
        }

        // Calculate duration
        const start = new Date(appointment.start_time);
        const end = new Date(appointment.end_time);
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        // Period duration (morning: 3.5 hours, evening: 6 hours)
        const periodDuration = appointment.period === 'morning' ? 3.5 : 6;
        const isFullPeriod = durationHours >= (periodDuration * 0.8);

        // Red = Full period (busy)
        if (isFullPeriod) {
            return '#EF4444';
        }

        // Green = Partial period
        return '#10B981';
    };

    const handleDateClick = (arg: any) => {
        setSelectedDate(new Date(arg.date));
        setSelectedSlot(null);
        setIsModalOpen(true);
    };

    const handleEventClick = (clickInfo: any) => {
        // TODO: Open appointment details/edit modal
        console.log('Event clicked:', clickInfo.event.extendedProps);
    };

    const handleSelect = (selectInfo: any) => {
        setSelectedDate(selectInfo.start);
        setSelectedSlot({ start: selectInfo.start, end: selectInfo.end });
        setIsModalOpen(true);
    };

    return (
        <div className="p-6">
            <Toaster position="top-center" richColors />

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">التقويم</h1>
                    <p className="text-muted-foreground mt-1">
                        إدارة مواعيد الصيانة والخدمات
                    </p>
                </div>
                <button
                    onClick={() => {
                        setSelectedDate(new Date());
                        setSelectedSlot(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    موعد جديد
                </button>
            </div>

            {/* Calendar */}
            <div className="rounded-lg border border-border bg-card p-4">
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="text-muted-foreground">جاري التحميل...</div>
                    </div>
                ) : (
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        buttonText={{
                            today: 'اليوم',
                            month: 'شهر',
                            week: 'أسبوع',
                            day: 'يوم',
                        }}
                        events={events}
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={true}
                        direction="rtl"
                        locale="ar"
                        slotMinTime="08:00:00"
                        slotMaxTime="23:00:00"
                        allDaySlot={false}
                        height="auto"
                        dateClick={handleDateClick}
                        select={handleSelect}
                        eventClick={handleEventClick}
                        eventContent={renderEventContent}
                    />
                )}
            </div>

            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onSuccess={fetchAppointments}
            />

            {/* Legend */}
            <div className="mt-4 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-[#EF4444]"></div>
                    <span>فترة كاملة</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-[#10B981]"></div>
                    <span>فترة جزئية</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-[#000000]"></div>
                    <span>إجازة</span>
                </div>
            </div>
        </div>
    );
}

// Custom event rendering
function renderEventContent(eventInfo: any) {
    const { extendedProps } = eventInfo.event;

    return (
        <div className="p-1 text-xs">
            <div className="font-medium truncate">{eventInfo.event.title}</div>
            {extendedProps.completion_code && (
                <div className="text-[10px] opacity-75">
                    ✓ {extendedProps.completion_code}
                </div>
            )}
        </div>
    );
}
