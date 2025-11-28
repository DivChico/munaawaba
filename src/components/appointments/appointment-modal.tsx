"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, User, Phone, Check, AlertCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { createClient } from "@/lib/supabase/client";

// --- Schema Definition ---

const appointmentSchema = z.object({
    customer_id: z.string().uuid("يجب اختيار العميل"),
    service_id: z.string().uuid("يجب اختيار نوع الخدمة"),
    technician_id: z.string().uuid().optional().nullable(),
    date: z.date({ message: "يجب اختيار التاريخ" }),
    period: z.enum(["morning", "evening"], {
        message: "يجب اختيار الفترة",
    }),
    start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "صيغة الوقت غير صحيحة"),
    end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "صيغة الوقت غير صحيحة"),
    notes: z.string().optional(),
}).refine((data) => {
    const [startH, startM] = data.start_time.split(':').map(Number);
    const [endH, endM] = data.end_time.split(':').map(Number);
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;
    return end > start;
}, {
    message: "وقت الانتهاء يجب أن يكون بعد وقت البداية",
    path: ["end_time"],
}).refine((data) => {
    const [startH] = data.start_time.split(':').map(Number);
    // Morning: 08:00 - 12:00 (approx)
    if (data.period === 'morning') {
        return startH >= 8 && startH < 14; // Allow some flexibility
    }
    // Evening: 16:00 - 22:00 (approx)
    if (data.period === 'evening') {
        return startH >= 16 && startH < 23;
    }
    return true;
}, {
    message: "الوقت المختار لا يتناسب مع الفترة المحددة",
    path: ["start_time"],
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

// --- Component ---

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate?: Date | null;
    selectedSlot?: { start: Date; end: Date } | null;
    onSuccess: () => void;
}

export function AppointmentModal({
    isOpen,
    onClose,
    selectedDate,
    selectedSlot,
    onSuccess,
}: AppointmentModalProps) {
    const supabase = createClient();
    const [customers, setCustomers] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    // Quick Add Customer State
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState("");
    const [newCustomerPhone, setNewCustomerPhone] = useState("");
    const [creatingCustomer, setCreatingCustomer] = useState(false);

    const form = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            customer_id: "",
            service_id: "",
            technician_id: null,
            date: new Date(),
            period: "morning",
            start_time: "09:00",
            end_time: "10:00",
            notes: "",
        },
    });

    // Fetch Data on Open
    useEffect(() => {
        if (isOpen) {
            fetchInitialData();

            // Reset form with selected date/slot
            if (selectedDate) {
                form.setValue("date", selectedDate);
            }
            if (selectedSlot) {
                form.setValue("date", selectedSlot.start);
                form.setValue("start_time", format(selectedSlot.start, "HH:mm"));
                form.setValue("end_time", format(selectedSlot.end, "HH:mm"));

                // Auto-detect period
                const hour = selectedSlot.start.getHours();
                if (hour >= 16) {
                    form.setValue("period", "evening");
                } else {
                    form.setValue("period", "morning");
                }
            }
        }
    }, [isOpen, selectedDate, selectedSlot, form]);

    const fetchInitialData = async () => {
        setLoadingData(true);
        try {
            const [custRes, servRes, techRes] = await Promise.all([
                supabase.from('customers').select('id, name, phone').order('name'),
                supabase.from('services').select('id, name_ar, default_duration').eq('is_active', true),
                supabase.from('profiles').select('id, full_name').eq('role', 'technician'),
            ]);

            if (custRes.data) setCustomers(custRes.data);
            if (servRes.data) setServices(servRes.data);
            if (techRes.data) setTechnicians(techRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("فشل تحميل البيانات");
        } finally {
            setLoadingData(false);
        }
    };

    const handleQuickAddCustomer = async () => {
        if (!newCustomerName || !newCustomerPhone) {
            toast.error("الرجاء إدخال الاسم ورقم الجوال");
            return;
        }

        setCreatingCustomer(true);
        try {
            const { data, error } = await supabase
                .from('customers')
                .insert({
                    name: newCustomerName,
                    phone: newCustomerPhone,
                })
                .select()
                .single();

            if (error) throw error;

            // Add to list and select
            setCustomers([...customers, data]);
            form.setValue("customer_id", data.id);
            setIsQuickAddOpen(false);
            setNewCustomerName("");
            setNewCustomerPhone("");
            toast.success("تم إضافة العميل بنجاح");
        } catch (error) {
            console.error("Error creating customer:", error);
            toast.error("حدث خطأ أثناء إضافة العميل");
        } finally {
            setCreatingCustomer(false);
        }
    };

    const onSubmit = async (data: AppointmentFormData) => {
        try {
            // 1. Prepare Timestamps
            const startDateTime = new Date(data.date);
            const [startH, startM] = data.start_time.split(':');
            startDateTime.setHours(Number(startH), Number(startM));

            const endDateTime = new Date(data.date);
            const [endH, endM] = data.end_time.split(':');
            endDateTime.setHours(Number(endH), Number(endM));

            // 2. Conflict Detection (if technician selected)
            if (data.technician_id) {
                const { data: conflicts } = await supabase
                    .from('appointments')
                    .select('id')
                    .eq('technician_id', data.technician_id)
                    .neq('status', 'cancelled')
                    .lt('start_time', endDateTime.toISOString())
                    .gt('end_time', startDateTime.toISOString());

                if (conflicts && conflicts.length > 0) {
                    toast.error("يوجد تعارض في المواعيد لهذا الفني");
                    return;
                }
            }

            // 3. Create Appointment
            const { error } = await supabase.from('appointments').insert({
                customer_id: data.customer_id,
                service_id: data.service_id,
                technician_id: data.technician_id || null,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
                period: data.period,
                notes: data.notes,
                status: 'scheduled',
            });

            if (error) throw error;

            toast.success("تم حفظ الموعد بنجاح");
            onSuccess();
            onClose();
            form.reset();
        } catch (error) {
            console.error("Error saving appointment:", error);
            toast.error("حدث خطأ أثناء حفظ الموعد");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">حجز موعد جديد</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Customer Selection */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel>العميل</FormLabel>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary h-8"
                                    onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                                >
                                    {isQuickAddOpen ? "إلغاء" : "+ عميل جديد"}
                                </Button>
                            </div>

                            {isQuickAddOpen ? (
                                <div className="bg-muted/50 p-4 rounded-lg space-y-3 border border-dashed border-primary/50">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            placeholder="اسم العميل"
                                            value={newCustomerName}
                                            onChange={(e) => setNewCustomerName(e.target.value)}
                                        />
                                        <Input
                                            placeholder="رقم الجوال"
                                            value={newCustomerPhone}
                                            onChange={(e) => setNewCustomerPhone(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleQuickAddCustomer}
                                        disabled={creatingCustomer}
                                        className="w-full"
                                    >
                                        {creatingCustomer ? "جاري الحفظ..." : "حفظ العميل"}
                                    </Button>
                                </div>
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="customer_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر العميل" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {customers.map((customer) => (
                                                        <SelectItem key={customer.id} value={customer.id}>
                                                            {customer.name} <span className="text-muted-foreground text-xs">({customer.phone})</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Service */}
                            <FormField
                                control={form.control}
                                name="service_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>نوع الخدمة</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر الخدمة" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {services.map((service) => (
                                                    <SelectItem key={service.id} value={service.id}>
                                                        {service.name_ar}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Technician */}
                            <FormField
                                control={form.control}
                                name="technician_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الفني (اختياري)</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || ""}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر الفني" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {technicians.map((tech) => (
                                                    <SelectItem key={tech.id} value={tech.id}>
                                                        {tech.full_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Date & Period */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>التاريخ</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-right font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP", { locale: ar })
                                                        ) : (
                                                            <span>اختر التاريخ</span>
                                                        )}
                                                        <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date(new Date().setHours(0, 0, 0, 0))
                                                    }
                                                    initialFocus
                                                    locale={ar}
                                                    dir="rtl"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="period"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الفترة</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="morning">صباحي (8 ص - 2 م)</SelectItem>
                                                <SelectItem value="evening">مسائي (4 م - 11 م)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Time Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="start_time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>من الساعة</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="end_time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>إلى الساعة</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Notes */}
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ملاحظات</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="أي تفاصيل إضافية..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={onClose}>
                                إلغاء
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "جاري الحفظ..." : "حفظ الموعد"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
