import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import TiltCard from '../TiltCard';

const Contact = ({ profile }) => {
  const { email = 'kuldeepmahajan.dev@gmail.com', phone = '+91 98765 43210', location = 'Pune, India' } = profile || {};

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

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = 'Name is required.';
    } else if (formData.name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Message is required.';
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
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
      const response = await fetch('http://localhost:5000/api/contact', {
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
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
        if (data.errors && data.errors.length > 0) {
          // Map backend validation errors back to inputs
          const backendErrors = {};
          data.errors.forEach((err) => {
            backendErrors[err.field] = err.message;
          });
          setErrors(backendErrors);
          setApiMessage('Please fix the errors below.');
        } else {
          setApiMessage(data.message || 'Something went wrong. Please try again.');
        }
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setSubmitStatus('error');
      setApiMessage('Failed to connect to the backend server. Please make sure the server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactDetails = [
    {
      icon: <Mail className="text-primary" size={20} />,
      label: 'Email Me',
      value: email,
      href: `mailto:${email}`
    },
    {
      icon: <Phone className="text-secondary" size={20} />,
      label: 'Call Me',
      value: phone,
      href: `tel:${phone.replace(/\s+/g, '')}`
    },
    {
      icon: <MapPin className="text-primary" size={20} />,
      label: 'Office Location',
      value: location,
      href: null
    }
  ];

  return (
    <section id="contact" className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white inline-block relative"
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
            Let's build something next-gen. Submit the form or reach out directly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              Contact Information
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Whether you are looking to hire a full-stack developer, require custom Power Platform business process automations, or simply want to chat about AI local integrations—my inbox is open.
            </p>

            <div className="space-y-4">
              {contactDetails.map((detail, idx) => (
                <TiltCard 
                  key={idx} 
                  className="flex items-center gap-4 py-4 px-5"
                  glowColor={idx % 2 === 0 ? 'primary' : 'secondary'}
                >
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    {detail.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                      {detail.label}
                    </h4>
                    {detail.href ? (
                      <a 
                        href={detail.href}
                        className="text-sm font-bold text-white hover:text-primary transition-colors mt-1 block"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <p className="text-sm font-bold text-white mt-1">
                        {detail.value}
                      </p>
                    )}
                  </div>
                </TiltCard>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <form 
              onSubmit={handleSubmit}
              className="glass-panel border border-white/10 p-6 sm:p-8 rounded-2xl space-y-5 shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                Send a Message
              </h3>

              {/* Status Alert Panels */}
              {submitStatus === 'success' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm animate-fadeIn">
                  <CheckCircle2 size={18} className="flex-shrink-0" />
                  <span>{apiMessage}</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fadeIn">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span>{apiMessage}</span>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="John Doe"
                    className={`w-full bg-white/5 border px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all ${
                      errors.name ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={10} /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="john@example.com"
                    className={`w-full bg-white/5 border px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all ${
                      errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={10} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Phone Number <span className="text-gray-600">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Tell me about your project context..."
                  className={`w-full bg-white/5 border px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none ${
                    errors.message ? 'border-red-500/50' : 'border-white/10 focus:border-primary/50'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:opacity-90 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:shadow-none transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
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
