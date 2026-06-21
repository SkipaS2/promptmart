'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Подключаем базу данных Supabase (ключи добавятся автоматически при деплое)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PromptMartApp() {
  const [prompts, setPrompts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePrompt, setActivePrompt] = useState(null);
  const [isProUser, setIsProUser] = useState(false); // По умолчанию пользователь Free

  // Автоматически стягиваем промпты из базы данных при открытии сайта
  useEffect(() => {
    async function fetchPrompts() {
      if (!supabaseUrl) return;
      const { data, error } = await supabase.from('prompts').select('*');
      if (data && !error) setPrompts(data);
    }
    fetchPrompts();
  }, []);

  // Фильтрация промптов по поиску и по кнопкам категорий из твоего дизайна
  const filteredPrompts = prompts.filter(prompt => {
    const matchesCategory = selectedCategory === 'Все' || prompt.category === selectedCategory;
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Функция для кнопки "Скопировать / Открыть"
  const handlePromptAction = (prompt) => {
    if (prompt.access_level === 'pro' && !isProUser) {
      alert('🔒 Этот промпт доступен только по подписке Pro! Оплатите тариф ниже.');
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // Если доступ есть — копируем в буфер обмена
    navigator.clipboard.writeText(prompt.content);
    setActivePrompt(prompt.content);
    alert(`📋 Промпт "${prompt.title}" успешно скопирован в буфер обмена!`);
  };

  // Имитация оплаты (перенаправление на платежку Stripe/ЮKassa)
  const handleCheckout = () => {
    alert('🔄 Перенаправление на защищенную страницу оплаты... (После оплаты ваш аккаунт получит статус PRO)');
    setIsProUser(true); // Для теста сразу включаем PRO после клика
  };

  return (
    <div style={{ backgroundColor: '#0A0A0F', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      
      {/* 1. НАВИГАЦИЯ */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#00E5CC' }}>⚡</span> Prompt<span style={{ color: '#00E5CC' }}>Mart</span>
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <a href="#catalog" style={{ color: '#A0A0AA', textDecoration: 'none' }}>Каталог</a>
          <a href="#features" style={{ color: '#A0A0AA', textDecoration: 'none' }}>Как это работает</a>
          <a href="#pricing" style={{ color: '#A0A0AA', textDecoration: 'none' }}>Цены</a>
          <button onClick={handleCheckout} style={{ background: 'linear-gradient(135deg, #00E5CC 0%, #7000FF 100%)', border: 'none', padding: '10px 20px', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            {isProUser ? '✨ Вы PRO пользователь' : 'Купить PRO'}
          </button>
        </div>
      </nav>

      {/* 2. HERO БЛОК */}
      <header style={{ textAlign: 'center', padding: '100px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(112,0,255,0.15) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0 }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 16px', borderRadius: '20px', display: 'inline-block', fontSize: '13px', color: '#00E5CC', marginBottom: '24px' }}>
            🚀 Интеграция с Supabase & Next.js завершена успешно
          </div>
          <h1 style={{ fontSize: '54px', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px' }}>
            Перестань тратить часы.<br />
            Получай <span style={{ color: '#00E5CC' }}>результат</span> за секунды.
          </h1>
          <p style={{ color: '#A0A0AA', fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Готовая библиотека протестированных ИИ-промптов. Подключайся к бэкенду и забирай готовые решения.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="#catalog" style={{ background: '#00E5CC', color: '#0A0A0F', padding: '14px 28px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>⚡ Открыть каталог</a>
            <a href="#pricing" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', padding: '14px 28px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>Тарифы ($12)</a>
          </div>
        </div>
      </header>

      {/* 3. КАТАЛОГ */}
      <section id="catalog" style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Исследуйте промпты</h2>
            <p style={{ color: '#A0A0AA' }}>Актуальная база данных, обновляемая в реальном времени</p>
          </div>
          
          <input 
            type="text" 
            placeholder="Поиск по названию или описанию..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ backgroundColor: '#131320', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 20px', color: '#FFF', width: '100%', maxWidth: '320px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
          {['Все', 'Маркетинг', 'Дизайн', 'Копирайтинг'].map(category => (
            <button 
              key={category} 
              onClick={() => setSelectedCategory(category)}
              style={{ backgroundColor: selectedCategory === category ? '#00E5CC' : '#131320', color: selectedCategory === category ? '#0A0A0F' : '#A0A0AA', border: 'none', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' }}
            >
              {category}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredPrompts.map((prompt) => (
            <div key={prompt.id} style={{ backgroundColor: '#131320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              <div>
                <span style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '12px', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', backgroundColor: prompt.access_level === 'free' ? 'rgba(0, 229, 204, 0.1)' : 'rgba(112, 0, 255, 0.1)', color: prompt.access_level === 'free' ? '#00E5CC' : '#9D4EDD' }}>
                  {prompt.access_level.toUpperCase()}
                </span>
                <div style={{ color: '#00E5CC', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>{prompt.category}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{prompt.title}</h3>
                <p style={{ color: '#A0A0AA', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>{prompt.description}</p>
              </div>
              <button 
                onClick={() => handlePromptAction(prompt)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: prompt.access_level === 'free' ? 'rgba(255,255,255,0.05)' : '#7000FF', color: '#FFF', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}
              >
                {prompt.access_level === 'free' ? '📋 Скопировать бесплатно' : '🔒 Открыть через PRO'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. СЕКЦИЯ ОПЛАТЫ И ТАРИФОВ ($12) */}
      <section id="pricing" style={{ padding: '100px 20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>Один тариф. Полный доступ.</h2>
        <p style={{ color: '#A0A0AA', marginBottom: '40px' }}>Присоединяйтесь к PRO и разблокируйте скрытые инженерные промпты.</p>
        
        <div style={{ background: 'linear-gradient(145deg, #131320 0%, #0A0A0F 100%)', border: '2px solid #7000FF', borderRadius: '24px', padding: '40px', maxWidth: '450px', margin: '0 auto', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#7000FF', color: '#FFF', padding: '4px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>ПОПУЛЯРНОЕ РЕШЕНИЕ</div>
          <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '10px' }}>План "PRO"</div>
          <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: '20px' }}>$12 <span style={{ fontSize: '16px', color: '#A0A0AA', fontWeight: 'normal' }}>/ месяц</span></div>
          
          <ul style={{ textAlign: 'left', color: '#A0A0AA', padding: '0', listStyle: 'none', marginBottom: '30px', lineHeight: '2' }}>
            <li>• Доступ к 2,400+ закрытым промптам</li>
            <li>• Промпты под Midjourney v6 и Claude 3.5 Opus</li>
            <li>• Обновление базы каждые 24 часа</li>
          </ul>
          
          <button onClick={handleCheckout} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#7000FF', color: '#FFF', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            Оформить подписку за $12
          </button>
        </div>
      </section>

    </div>
  );
}
