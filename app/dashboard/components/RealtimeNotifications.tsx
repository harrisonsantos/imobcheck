'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Notification {
  id: string;
  type: 'anomalia' | 'lead' | 'negocio' | 'webhook';
  title: string;
  message: string;
  severity?: 'baixa' | 'media' | 'alta';
  timestamp: string;
  read: boolean;
}

export function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    // Inscrever em mudanças na tabela de anomalias
    const anomaliasChannel = supabase
      .channel('anomalias-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'anomalias',
        },
        (payload) => {
          const anomalia = payload.new;
          const notification: Notification = {
            id: `anomalia-${anomalia.id}-${Date.now()}`,
            type: 'anomalia',
            title: 'Nova Anomalia Detectada',
            message: `${anomalia.tipo}: ${anomalia.descricao}`,
            severity: anomalia.severidade,
            timestamp: new Date().toISOString(),
            read: false,
          };
          setNotifications((prev) => [notification, ...prev].slice(0, 20));
          setUnreadCount((prev) => prev + 1);
          
          // Mostrar notificação do navegador se permitido
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('ImobCheck - Nova Anomalia', {
              body: notification.message,
              icon: '/favicon.ico',
              tag: notification.id,
            });
          }
        }
      )
      .subscribe();

    // Inscrever em novos leads
    const leadsChannel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
        },
        (payload) => {
          const lead = payload.new;
          const notification: Notification = {
            id: `lead-${lead.id}-${Date.now()}`,
            type: 'lead',
            title: 'Novo Lead Recebido',
            message: `Lead: ${lead.nome || 'Sem nome'} - ${lead.origem || 'origem desconhecida'}`,
            timestamp: new Date().toISOString(),
            read: false,
          };
          setNotifications((prev) => [notification, ...prev].slice(0, 20));
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    // Inscrever em novos negócios
    const negociosChannel = supabase
      .channel('negocios-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'negocios',
        },
        (payload) => {
          const negocio = payload.new;
          const notification: Notification = {
            id: `negocio-${negocio.id}-${Date.now()}`,
            type: 'negocio',
            title: 'Novo Negócio Criado',
            message: `Valor: R$ ${Number(negocio.valor_venda || 0).toLocaleString('pt-BR')} - Status: ${negocio.status}`,
            timestamp: new Date().toISOString(),
            read: false,
          };
          setNotifications((prev) => [notification, ...prev].slice(0, 20));
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    // Solicitar permissão para notificações do navegador
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Cleanup
    return () => {
      supabase.removeChannel(anomaliasChannel);
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(negociosChannel);
    };
  }, [supabase]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'anomalia':
        return '⚠️';
      case 'lead':
        return '👤';
      case 'negocio':
        return '💰';
      case 'webhook':
        return '🔗';
      default:
        return '📬';
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Notificações</h3>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[#1B489B] hover:text-[#0C0F24] font-semibold"
                  >
                    Marcar todas lidas
                  </button>
                  <button
                    onClick={clearNotifications}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold"
                  >
                    Limpar
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-sm text-gray-900 truncate">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        {notification.severity && (
                          <span
                            className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded border ${getSeverityColor(
                              notification.severity
                            )}`}
                          >
                            Severidade: {notification.severity}
                          </span>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Badge de status online
export function OnlineStatusBadge() {
  const [isOnline, setIsOnline] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel('presence').subscribe((status) => {
      setIsOnline(status === 'SUBSCRIBED');
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`}
      ></span>
      <span className="text-xs text-gray-600">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}
