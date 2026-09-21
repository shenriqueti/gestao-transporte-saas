(function () {
    const config = window.APP_CONFIG;
    const supabase = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);

    async function request(url, options = {}) {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
            window.location.replace('/');
            throw new Error('Sua sessão expirou. Entre novamente.');
        }

        const headers = new Headers(options.headers || {});
        headers.set('Authorization', `Bearer ${data.session.access_token}`);
        if (options.body && !headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            await supabase.auth.signOut();
            window.location.replace('/');
            throw new Error('Sua sessão expirou. Entre novamente.');
        }
        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.error || 'Não foi possível concluir a operação.');
        }
        if (response.status === 204) return null;
        return response.json();
    }

    window.apiClient = { request };
})();
