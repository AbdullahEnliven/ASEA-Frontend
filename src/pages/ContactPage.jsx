import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-black mb-6">Get in Touch</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have a question about ASEA, need technical support, or want to discuss enterprise options? We're here to help.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-gray-400 mb-2">For general inquiries and support.</p>
              <a href="mailto:support@asea.dev" className="text-blue-400 hover:text-blue-300 font-medium">
                support@asea.dev
              </a>
            </div>
          </div>

          <div className="flex items-start gap-6">
             <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Community Discord</h3>
              <p className="text-gray-400 mb-2">Join thousands of builders sharing tips.</p>
              <a href="#" className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium">
                Join our server <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
              <MapPin className="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Headquarters</h3>
              <p className="text-gray-400">
                123 Innovation Drive<br/>
                San Francisco, CA 94103<br/>
                United States
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6 }}
        >
          <form className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="jane@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea 
                  rows={5}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="How can we help?"
                />
              </div>

              <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                Send Message
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}