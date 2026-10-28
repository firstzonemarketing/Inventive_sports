import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, MapPin, Phone, Mail } from 'lucide-react';
import { useCms } from '../lib/cms';
import { scrollEngine } from '../lib/scroll';

interface JoinAcademyProps {
  selectedDiscipline?: string;
  selectedEventNote?: string;
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  discipline: string;
  preferred_center: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  discipline?: string;
  message?: string;
}

const DISCIPLINES_OPTIONS = [
  'Football',
  'Cricket',
  'Chess',
  'Swimming',
  'Skating',
  'Basketball',
  'Dance and Performing Arts',
  'Events & Tournaments',
];

export const JoinAcademy: React.FC<JoinAcademyProps> = ({
  selectedDiscipline,
  selectedEventNote,
}) => {
  const { settings, submitLeadEnquiry, navigate } = useCms();
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    phone: '',
    discipline: DISCIPLINES_OPTIONS[0],
    preferred_center: 'Kammanahalli Center',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [serverMessage, setServerMessage] = useState('');

  useEffect(() => {
    if (!selectedDiscipline) return;
    const match = DISCIPLINES_OPTIONS.find((item) =>
      item.toLowerCase().includes(selectedDiscipline.toLowerCase().split(' ')[0])
    );
    if (match) {
      setValues((prev) => ({ ...prev, discipline: match }));
    }
  }, [selectedDiscipline]);

  useEffect(() => {
    if (!selectedEventNote) return;
    setValues((prev) => ({
      ...prev,
      discipline: 'Events & Tournaments',
      message: `Enquiring regarding event: ${selectedEventNote}`,
    }));
  }, [selectedEventNote]);

  const validate = (form: FormValues): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (form.phone.trim()) {
      const phonePattern = /^[0-9+\-() ]{7,20}$/;
      if (!phonePattern.test(form.phone.trim())) {
        nextErrors.phone = 'Please enter a valid contact phone number.';
      }
    }
    if (!form.discipline.trim()) {
      nextErrors.discipline = 'Please select a preferred discipline.';
    }
    if (!form.message.trim() || form.message.trim().length < 8) {
      nextErrors.message = 'Please include a short message.';
    }
    return nextErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitStatus('submitting');

    const result = await submitLeadEnquiry({
      name: values.name,
      email: values.email,
      phone: values.phone,
      preferred_discipline: values.discipline,
      enquiry_type: `Center: ${values.preferred_center}`,
      message: values.message,
      source_page: window.location.pathname || '/',
    });

    if (result.ok) {
      setSubmitStatus('success');
      setServerMessage(result.message);
      setValues((prev) => ({
        ...prev,
        name: '',
        email: '',
        phone: '',
        message: '',
      }));
    } else {
      setSubmitStatus('error');
      setServerMessage(result.message);
    }
  };

  const handleFocusForm = (
    e: React.MouseEvent<HTMLAnchorElement>,
    focusTargetId: string
  ) => {
    e.preventDefault();
    scrollEngine.scrollTo('#enquiry-form', -84);
    const input = document.getElementById(focusTargetId);
    if (input) {
      window.setTimeout(() => input.focus(), 450);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="join-academy-heading"
      className="relative w-full py-24 sm:py-32 bg-[#FFFFFF] border-b border-[#E7E7E7]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section 8 — Final Call to Action Banner */}
        <div
          data-reveal
          className="relative w-full overflow-hidden border border-[#E7E7E7] bg-[#101010] mb-16"
        >
          <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden">
            <img
              src="/images/hero/join-cta.jpg"
              alt="Athletes training together at Inventive Sports & Performing Arts"
              loading="lazy"
              className="w-full h-full object-cover object-center opacity-70"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#101010]/95 via-[#101010]/70 to-transparent"
            />

            <div className="absolute inset-0 p-6 sm:p-10 lg:p-14 flex flex-col justify-end max-w-3xl">
              <div className="inline-flex items-center gap-2.5 mb-3">
                <span
                  aria-hidden="true"
                  className="w-6 h-[2px] bg-[#D71920]"
                />
                <span className="font-mono-label text-[10px] sm:text-xs text-[#FFFFFF]">
                  START YOUR JOURNEY
                </span>
              </div>

              <h2
                id="join-academy-heading"
                className="heading-section text-[#FFFFFF]"
              >
                YOUR JOURNEY STARTS WITH ONE STEP.
              </h2>

              <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-[#F5F5F5] max-w-xl leading-relaxed">
                Join Inventive Sports &amp; Performing Arts and experience
                structured training, expert guidance, and a community built for
                growth.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <a
                  href="#enquiry-form"
                  onClick={(e) => handleFocusForm(e, 'enquiry-full-name')}
                  className="inline-flex items-center gap-2.5 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-6 py-3.5 hover:bg-[#FFFFFF] hover:text-[#151515] transition-colors duration-200 group"
                >
                  <span>ENQUIRE NOW</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>

                <button
                  type="button"
                  onClick={() => navigate('/sports')}
                  className="inline-flex items-center gap-2.5 bg-transparent text-[#FFFFFF] border border-[#FFFFFF] font-mono-label text-xs px-6 py-3.5 hover:bg-[#FFFFFF] hover:text-[#151515] transition-colors duration-200 cursor-pointer"
                >
                  <span>EXPLORE PROGRAMS</span>
                </button>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="h-1.5 w-full bg-[#D71920]" />
        </div>

        {/* Live Enquiry Form + Bangalore Centers Info */}
        <div
          id="enquiry-form"
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start"
        >
          {/* Left 5 Columns: Academy Centers & Contact */}
          <div data-reveal className="lg:col-span-5 space-y-6">
            <div>
              <span className="font-mono-label text-[11px] text-[#D71920]">
                ACADEMY ENQUIRY // DIRECT REGISTRATION
              </span>
              <h3 className="mt-2 heading-scene text-[#151515]">
                Connect With Our Coaching Team.
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#626262] leading-relaxed">
                Submit your enquiry below. Your request is saved directly to the
                Inventive Sports management system for priority follow-up.
              </p>
            </div>

            <div className="p-6 bg-[#F5F5F5] border border-[#E7E7E7] space-y-4">
              <div className="font-mono-label text-[10px] text-[#D71920]">
                BANGALORE ACADEMY CENTERS
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-[#151515]">
                <MapPin className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Kammanahalli Center</div>
                  <div className="text-[#626262]">{settings.center_1}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-[#151515]">
                <MapPin className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Hesaraghatta Center</div>
                  <div className="text-[#626262]">{settings.center_2}</div>
                </div>
              </div>
              <div className="pt-3 border-t border-[#E7E7E7] flex flex-col gap-2 text-xs text-[#626262]">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#D71920]" />
                  <span>{settings.contact_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D71920]" />
                  <span>{settings.contact_phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: Live Laravel Lead Form */}
          <div
            data-reveal
            className="lg:col-span-7 bg-[#FFFFFF] border border-[#E7E7E7] p-6 sm:p-10 shadow-[0_12px_36px_rgba(21,21,21,0.05)]"
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="enquiry-full-name"
                    className="block font-mono-label text-xs text-[#151515] mb-2"
                  >
                    FULL NAME <span className="text-[#D71920]">*</span>
                  </label>
                  <input
                    id="enquiry-full-name"
                    name="name"
                    type="text"
                    required
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter student or parent name"
                    className="w-full px-4 py-3 bg-[#F5F5F5] border border-[#E7E7E7] text-sm text-[#151515] focus:bg-[#FFFFFF] focus:border-[#151515] transition-colors"
                  />
                  {errors.name && (
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#D71920]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="enquiry-email"
                    className="block font-mono-label text-xs text-[#151515] mb-2"
                  >
                    EMAIL ADDRESS <span className="text-[#D71920]">*</span>
                  </label>
                  <input
                    id="enquiry-email"
                    name="email"
                    type="email"
                    required
                    value={values.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-[#F5F5F5] border border-[#E7E7E7] text-sm text-[#151515] focus:bg-[#FFFFFF] focus:border-[#151515] transition-colors"
                  />
                  {errors.email && (
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#D71920]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="enquiry-discipline"
                    className="block font-mono-label text-xs text-[#151515] mb-2"
                  >
                    DISCIPLINE <span className="text-[#D71920]">*</span>
                  </label>
                  <select
                    id="enquiry-discipline"
                    name="discipline"
                    value={values.discipline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#F5F5F5] border border-[#E7E7E7] text-sm text-[#151515] focus:bg-[#FFFFFF] focus:border-[#151515] transition-colors"
                  >
                    {DISCIPLINES_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="enquiry-center"
                    className="block font-mono-label text-xs text-[#151515] mb-2"
                  >
                    PREFERRED CENTER
                  </label>
                  <select
                    id="enquiry-center"
                    name="preferred_center"
                    value={values.preferred_center}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#F5F5F5] border border-[#E7E7E7] text-sm text-[#151515] focus:bg-[#FFFFFF] focus:border-[#151515] transition-colors"
                  >
                    <option value="Kammanahalli Center">
                      Kammanahalli Center
                    </option>
                    <option value="Hesaraghatta Center">
                      Hesaraghatta Center
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="enquiry-phone"
                    className="block font-mono-label text-xs text-[#151515] mb-2"
                  >
                    PHONE NUMBER
                  </label>
                  <input
                    id="enquiry-phone"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={handleChange}
                    placeholder="+91 98000 00000"
                    className="w-full px-4 py-3 bg-[#F5F5F5] border border-[#E7E7E7] text-sm text-[#151515] focus:bg-[#FFFFFF] focus:border-[#151515] transition-colors"
                  />
                  {errors.phone && (
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#D71920]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="enquiry-message"
                  className="block font-mono-label text-xs text-[#151515] mb-2"
                >
                  MESSAGE / STUDENT DETAILS <span className="text-[#D71920]">*</span>
                </label>
                <textarea
                  id="enquiry-message"
                  name="message"
                  rows={4}
                  required
                  value={values.message}
                  onChange={handleChange}
                  placeholder="Share student age, preferred batch timings, or questions..."
                  className="w-full px-4 py-3 bg-[#F5F5F5] border border-[#E7E7E7] text-sm text-[#151515] focus:bg-[#FFFFFF] focus:border-[#151515] transition-colors resize-y"
                />
                {errors.message && (
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#D71920]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={submitStatus === 'submitting'}
                  className="inline-flex items-center justify-center gap-3 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-7 py-4 hover:bg-[#151515] transition-colors duration-200 cursor-pointer disabled:opacity-60 group"
                >
                  <span>
                    {submitStatus === 'submitting'
                      ? 'SAVING ENQUIRY...'
                      : 'SUBMIT ENQUIRY'}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>

                <span className="font-tech-code text-[10px] text-[#626262]">
                  STORED IN LARAVEL LEADS DATABASE
                </span>
              </div>

              {submitStatus === 'success' && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-4 p-5 bg-[#F5F5F5] border-l-4 border-[#D71920] space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-[#151515] font-mono-label text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#D71920] shrink-0" />
                    <span>ENQUIRY RECEIVED</span>
                  </div>
                  <p className="text-xs text-[#626262] leading-relaxed">
                    {serverMessage}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
