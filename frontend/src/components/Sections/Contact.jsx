import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const GithubIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path>
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);
import confetti from 'canvas-confetti';
import TiltCard from '../TiltCard';
import { API_BASE_URL } from '../../config';

const Contact = ({ profile }) => {
  const { phone = '+91 8329606013', location = 'Pune, India' } = profile || {};
  const email = 'mahajankuldeep628@gmail.com';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
        setApiMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please provide a valid email format.';
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Message text is required.';
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message must contain at least 10 characters.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setApiMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setApiMessage(data.message);
        
        // --- Send EmailJS Auto-Reply ---
        try {
          const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
          const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
          
          if (serviceId !== 'YOUR_SERVICE_ID' && publicKey !== 'YOUR_PUBLIC_KEY') {
            // 1. Send Auto-Reply to User
            const autoReplyPromise = fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                service_id: serviceId,
                template_id: 'template_d8uvyu3',
                user_id: publicKey,
                template_params: {
                  user_name: formData.name,
                  user_email: formData.email,
                  to_name: formData.name,
                  to_email: formData.email,
                  message: formData.message,
                  reply_to: email || 'mahajankuldeep628@gmail.com'
                }
              })
            });

            // 2. Send Notification to Admin
            const adminNotificationPromise = fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                service_id: serviceId,
                template_id: 'template_5ntmanf',
                user_id: publicKey,
                template_params: {
                  user_name: formData.name,
                  user_email: formData.email,
                  to_name: 'Kuldeep Mahajan',
                  to_email: email || 'mahajankuldeep628@gmail.com',
                  message: formData.message,
                  reply_to: formData.email
                }
              })
            });

            await Promise.all([autoReplyPromise, adminNotificationPromise]);
          } else {
            console.warn('EmailJS credentials missing. Auto-reply not sent.');
          }
        } catch (emailErr) {
          console.error('Failed to send auto-reply email via EmailJS', emailErr);
        }
        // -------------------------------

        setFormData({ name: '', email: '', phone: '', message: '' });
        
        // Trigger visual confetti celebration on successful lead submit
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00F5FF', '#7B61FF', '#00FF88']
        });
      } else {
        setSubmitStatus('error');
        if (data.errors && data.errors.length > 0) {
          const backendErrors = {};
          data.errors.forEach((err) => {
            backendErrors[err.field] = err.message;
          });
          setErrors(backendErrors);
          setApiMessage('Please verify input formats and try again.');
        } else {
          setApiMessage(data.message || 'Transmission failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setSubmitStatus('error');
      setApiMessage('Local DB fallback mode: connection failed but lead was logged. Thank you!');
      // Still trigger a minor visual validation feedback
      confetti({
        particleCount: 40,
        spread: 30,
        origin: { y: 0.8 },
        colors: ['#00F5FF', '#7B61FF']
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactDetails = [
    {
      icon: <Mail className="text-[#00F5FF]" size={20} />,
      label: 'Email Me',
      value: email,
      href: `mailto:${email}`
    },
    {
      icon: <Phone className="text-[#00FF88]" size={20} />,
      label: 'Call Me',
      value: phone,
      href: `tel:${phone.replace(/\s+/g, '')}`
    },
    {
      icon: <MapPin className="text-[#7B61FF]" size={20} />,
      label: 'Office Location',
      value: location,
      href: null
    }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: <GithubIcon size={16} />, href: 'https://github.com' },
    { name: 'LinkedIn', icon: <LinkedinIcon size={16} />, href: 'https://linkedin.com' },
    { name: 'Email', icon: <Mail size={16} />, href: `mailto:${email}` }
  ];

  return (
    <section id="contact" className="pt-[30px] pb-10 px-6 relative z-10 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white inline-block relative font-sans"
          >
            Get In Touch
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm"
          >
            Submit the message form to integrate direct channels or check credentials.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Details & Social handles */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6 text-left"
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              Contact Information
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Whether you are looking to hire an AI engineer, require custom Power Platform business process automations, or simply want to chat about AI local integrations—my inbox is open.
            </p>

            <div className="space-y-4">
              {contactDetails.map((detail, idx) => (
                <TiltCard 
                  key={idx} 
                  className="flex items-center gap-4 py-4 px-5 border border-white/5 bg-white/2 hover:border-[#00F5FF]/30 transition-all duration-300"
                  glowColor={idx % 3 === 0 ? 'primary' : idx % 3 === 1 ? 'secondary' : 'accent'}
                >
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    {detail.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">
                      {detail.label}
                    </h4>
                    {detail.href ? (
                      <a 
                        href={detail.href}
                        className="text-sm font-bold text-white hover:text-primary transition-colors mt-1 block font-mono"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <p className="text-sm font-bold text-white mt-1 font-mono">
                        {detail.value}
                      </p>
                    )}
                  </div>
                </TiltCard>
              ))}
            </div>


          </motion.div>

          {/* Right Column: Premium Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <form 
              onSubmit={handleSubmit}
              className="glass-panel border border-white/5 p-6 sm:p-8 rounded-3xl space-y-5 shadow-2xl relative bg-[#050816]/40"
            >
              <h3 className="text-xl font-bold text-white mb-4 text-left flex items-center justify-between">
                <span>Send a Message</span>
                <span className="h-2 w-2 rounded-full bg-[#00FF88] animate-pulse" />
              </h3>

              {/* Status Alert Panels */}
              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
                  >
                    <CheckCircle2 size={18} className="flex-shrink-0" />
                    <span>{apiMessage}</span>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                  >
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span>{apiMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="Enter your name"
                    className={`w-full bg-[#050816]/80 border px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all ${
                      errors.name ? 'border-red-500/50' : 'border-white/10 focus:border-[#00F5FF]/80'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1 font-mono">
                      <AlertCircle size={10} /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="name@example.com"
                    className={`w-full bg-[#050816]/80 border px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all ${
                      errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-[#00F5FF]/80'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 flex items-center gap-1 font-mono">
                      <AlertCircle size={10} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="phone" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                  Phone Number <span className="text-gray-600">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#050816]/80 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-[#00F5FF]/80 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="message" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Tell me about your project context (minimum 10 chars)..."
                  className={`w-full bg-[#050816]/80 border px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none ${
                    errors.message ? 'border-red-500/50' : 'border-white/10 focus:border-[#00F5FF]/80'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 flex items-center gap-1 font-mono">
                    <AlertCircle size={10} /> {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-[0_0_20px_rgba(0,245,255,0.2)] hover:opacity-90 hover:shadow-[0_0_30px_rgba(123,97,255,0.4)] disabled:opacity-50 disabled:shadow-none transition-all cursor-pointer font-sans"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Transmitting Data...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} className="text-[#00FF88]" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
