import React from 'react';

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-6 relative">
      <div className="max-w-4xl mx-auto text-left relative z-20">
        <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-slate-800/50 p-12">
          <h2 className="text-4xl font-bold text-white mb-8">
            About Jinshi Chat
          </h2>
          
          <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
            <p>
              Jinshi Chat is a minimal, clean, and functional AI chat interface designed 
              for seamless conversations with advanced language models. Built with modern 
              web technologies and a focus on user experience.
            </p>
            
            <p>
              Powered by <span className="text-white font-medium">Groq's high-performance AI models</span> including 
              Llama3-70B for coding tasks, Mixtral for long context conversations, 
              and Llama3-8B for fast responses, offering you the flexibility to choose 
              the right model for your specific needs.
            </p>
            
            <p>
              The interface features a <span className="text-white font-medium">dark, space-inspired design</span> with 
              animated elements, smooth transitions, and interactive components that 
              create an immersive chat experience while maintaining focus on functionality.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Fast Performance</h3>
              <p className="text-slate-400 text-sm">Optimized for speed with Groq's lightning-fast inference</p>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Smart Models</h3>
              <p className="text-slate-400 text-sm">Multiple AI models for different use cases and requirements</p>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">User Focused</h3>
              <p className="text-slate-400 text-sm">Clean interface designed for optimal user experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}