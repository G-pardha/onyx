import React, { useState } from 'react';
import { Compass, Search, Star, Zap, Image, Code, FileText, Music } from 'lucide-react';

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('For You');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'For You', icon: Star },
    { name: 'Coding', icon: Code },
    { name: 'Writing', icon: FileText },
    { name: 'Image Gen', icon: Image },
    { name: 'Productivity', icon: Zap },
    { name: 'Audio', icon: Music },
  ];

  const allModels = [
    { name: 'Onyx-1', desc: 'Our fastest, most capable flagship model.', tags: ['Smart', 'Fast'], color: 'from-primary to-accent', category: 'For You' },
    { name: 'Onyx-Code', desc: 'Specialized model for software engineering tasks.', tags: ['Coding', 'Logic'], color: 'from-blue-500 to-indigo-500', category: 'Coding' },
    { name: 'Onyx-Vision', desc: 'Advanced image analysis and generation.', tags: ['Vision', 'Creative'], color: 'from-purple-500 to-pink-500', category: 'Image Gen' },
    { name: 'Onyx-Write', desc: 'Expert-level writing assistant for any genre.', tags: ['Writing', 'Creative'], color: 'from-emerald-500 to-teal-500', category: 'Writing' },
    { name: 'Onyx-Flow', desc: 'Automate workflows and boost productivity.', tags: ['Automation', 'Fast'], color: 'from-amber-500 to-orange-500', category: 'Productivity' },
    { name: 'Onyx-Audio', desc: 'Transcription, synthesis, and audio analysis.', tags: ['Audio', 'Speech'], color: 'from-rose-500 to-pink-500', category: 'Audio' },
  ];

  const filteredModels = allModels.filter(m => {
    const matchesCategory = activeCategory === 'For You' || m.category === activeCategory;
    const matchesSearch = searchQuery === '' || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 pt-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <div className="flex items-center gap-3 text-accent mb-2">
            <Compass size={24} />
            <h1 className="text-2xl font-bold text-text tracking-tight">Explore</h1>
          </div>
          <p className="text-muted">Discover models, plugins, and capabilities to supercharge your workflow.</p>
        </header>

        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for models, agents, or tools..." 
            className="w-full bg-card/50 border border-foreground/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary/50 focus:bg-card transition-all shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === cat.name ? 'bg-foreground/10 text-text' : 'bg-transparent text-muted hover:bg-foreground/5 hover:text-text'}`}
            >
              <cat.icon size={16} className={activeCategory === cat.name ? 'text-accent' : ''} />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Models Grid */}
        <section>
          <h2 className="text-lg font-semibold text-text mb-4">
            {activeCategory === 'For You' ? 'Featured Models' : activeCategory + ' Models'}
            <span className="text-xs text-muted ml-2">({filteredModels.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((model) => (
              <div key={model.name} className="bg-card border border-foreground/5 rounded-2xl p-5 hover:border-foreground/20 transition-all cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                  <Zap size={20} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-text mb-2">{model.name}</h3>
                <p className="text-sm text-muted mb-4 line-clamp-2">{model.desc}</p>
                <div className="flex items-center gap-2">
                  {model.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-medium px-2 py-1 bg-foreground/5 text-muted rounded-md uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
            {filteredModels.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted">
                No models found matching your search.
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
