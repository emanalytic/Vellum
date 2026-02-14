import React from 'react';
import { supabase } from '../services/supabase';
import { LogIn, Github, Twitter, Linkedin, Lightbulb, MoveRight, Star, Pencil } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Logo from '../components/common/Logo';

const Login: React.FC = () => {
  const { showToast } = useToast();
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Error logging in:', error.message);
      showToast('Failed to log in: ' + error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-paper-bg flex flex-col relative overflow-hidden text-ink font-type selection:bg-highlighter-yellow/40">
      
      {/* ─── Paper Texture & Grid Pattern ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
      />

      {/* ─── Vivid Blobs & Lighting ─── */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-highlighter-yellow/30 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-highlighter-pink/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      
      {/* ─── Floating Elements ─── */}
      <div className="absolute top-20 left-10 hidden lg:block opacity-20 rotate-12">
        <Star size={64} className="text-highlighter-yellow fill-highlighter-yellow" />
      </div>
      <div className="absolute bottom-40 right-20 hidden lg:block opacity-20 -rotate-12">
        <Pencil size={80} className="text-ink" />
      </div>

      {/* ─── Navbar ─── */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-8">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="transform group-hover:rotate-12 transition-transform duration-300">
            <Logo size={48} />
          </div>
          <h1 className="marker-text text-4xl -rotate-2 group-hover:rotate-0 transition-transform">
            Vellum
          </h1>
        </div>
      </nav>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 relative z-10 w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 w-full">
          
          {/* Left: Typography & Hero */}
          <div className="flex-1 text-center lg:text-left relative">
            
            {/* Scribble Arrow */}
            <div className="absolute -top-12 -left-12 hidden lg:block opacity-60">
               <svg width="100" height="80" viewBox="0 0 100 80" fill="none" className="text-highlighter-pink transform -rotate-12">
                 <path d="M10 40 Q 50 10 90 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
                 <path d="M90 40 L 80 30 M 90 40 L 80 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
               </svg>
            </div>

            <div className="inline-block relative mb-6">
              <span className="font-sketch font-bold text-sm tracking-widest uppercase bg-ink text-white px-3 py-1 rotate-2 inline-block">
                Beta Access
              </span>
            </div>

            <h2 className="font-marker text-6xl md:text-8xl leading-[0.9] mb-8 relative">
              <span className="relative z-10">Chaos is just</span> <br />
              <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-ink to-ink/70">
                undesigned potential.
              </span>
              {/* Underline Scribble */}
              <svg className="absolute w-[110%] h-12 -bottom-2 -left-2 text-highlighter-yellow -z-10 opacity-90" viewBox="0 0 300 20" fill="none">
                 <path d="M5 10 C 50 15, 150 15, 290 8" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeOpacity="0.6" />
              </svg>
            </h2>

            <p className="font-hand text-2xl md:text-3xl text-ink/80 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Design your day like a <span className="relative inline-block px-1">
                <span className="absolute inset-0 bg-highlighter-pink/30 skew-x-12 transform -rotate-1"></span>
                <span className="relative font-bold">masterpiece</span>
              </span>. 
              Vellum turns your chaos into a curated journal of focus.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 font-sketch text-xs opacity-50 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                 <Lightbulb size={14} /> AI-Powered
              </div>
              <div className="w-1 h-1 bg-ink rounded-full" />
              <div className="flex items-center gap-2">
                 <Pencil size={14} /> Lo-Fi Aesthetics
              </div>
            </div>
          </div>

          {/* Right: The Login "Card" */}
          <div className="flex-1 w-full max-w-md relative group perspective-1000">
             
             {/* Backing Card (Rotation Effect) */}
             <div className="absolute inset-0 bg-ink rounded-sm transform translate-x-2 translate-y-2 rotate-2 group-hover:rotate-3 transition-transform duration-300" />
             
             {/* Main Card */}
             <div className="bg-white p-8 md:p-12 sketch-border relative transform -rotate-1 group-hover:rotate-0 transition-transform duration-500 shadow-xl flex flex-col items-center text-center border-2 border-ink">
                
                {/* Tape */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 h-8 bg-highlighter-yellow/40 backdrop-blur-sm -rotate-1 shadow-sm border-l border-r border-white/50" />

                <div className="mb-8 relative">
                   <div className="w-24 h-24 rounded-full border-4 border-ink flex items-center justify-center bg-paper-bg relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
                      <LogIn size={40} className="text-ink relative z-10" />
                   </div>
                   <div className="absolute -bottom-2 -right-2 bg-highlighter-pink text-ink text-xs font-bold px-2 py-1 border-2 border-ink rotate-6 font-sketch uppercase">
                      Start Here
                   </div>
                </div>
                
                <h3 className="font-marker text-3xl mb-3">Open Your Book</h3>
                <p className="font-hand text-lg opacity-60 mb-8 leading-snug">
                  Your desk is ready. <br/> The coffee is warm(ish).
                </p>

                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-ink text-white font-bold text-lg rounded-sm hover:translate-y-[-2px] hover:shadow-lg active:translate-y-px transition-all group/btn relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Continue with Google <MoveRight className="group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  {/* Button Hover Highlight */}
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </button>

                <div className="mt-8 pt-6 border-t-2 border-dashed border-ink/10 w-full">
                   <p className="font-sketch text-[10px] opacity-40 uppercase tracking-widest">
                     By entering, you agree to focus.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 py-8 text-center">
        <div className="flex justify-center gap-6 mb-4 opacity-50">
          {[Github, Twitter, Linkedin].map((Icon, i) => (
            <a key={i} href="#" className="p-2 hover:bg-ink/5 rounded-full hover:scale-110 transition-all hover:text-highlighter-pink">
              <Icon size={20} />
            </a>
          ))}
        </div>
        <p className="font-sketch text-xs opacity-40">
           &copy; {new Date().getFullYear()} Vellum. Crafted with <span className="text-red-400">♥</span> by Eman.
        </p>
      </footer>

    </div>
  );
};

export default Login;
