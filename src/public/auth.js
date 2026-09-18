(function () {
    const config = window.APP_CONFIG;
    const supabase = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    const isProtectedPage = window.location.pathname === '/protected.html';

    async function redirectForSession() {
        const { data } = await supabase.auth.getSession();
        if (isProtectedPage && !data.session) {
            window.location.replace('/');
        } else if (!isProtectedPage && data.session) {
            window.location.replace('/protected.html');
        }
    }

    supabase.auth.onAuthStateChange((_event, session) => {
        if (isProtectedPage && !session) {
            window.location.replace('/');
        }
    });

    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const message = document.querySelector('#login-message');
            const email = loginForm.email.value.trim();
            const password = loginForm.password.value;
            if (!email || !password) {
                message.textContent = 'Informe e-mail e senha.';
                return;
            }

            message.textContent = 'Entrando...';
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                message.textContent = 'Não foi possível entrar. Verifique suas credenciais.';
                return;
            }
            window.location.replace('/protected.html');
        });
    }

    const logoutButton = document.querySelector('#logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
                document.querySelector('#page-message').textContent = 'Não foi possível sair. Tente novamente.';
                return;
            }
            window.location.replace('/');
        });
    }

    async function loadStudents() {
        if (!window.apiClient) return;
        const message = document.querySelector('#page-message');
        const list = document.querySelector('#student-list');
        try {
            const students = await window.apiClient.request('/api/alunos');
            list.replaceChildren(...students.map((student) => {
                const item = document.createElement('li');
                const details = document.createElement('span');
                details.textContent = `${student.nome} - ${student.escola}`;
                const removeButton = document.createElement('button');
                removeButton.className = 'danger';
                removeButton.type = 'button';
                removeButton.textContent = 'Remover';
                removeButton.addEventListener('click', () => removeStudent(student.id));
                const editButton = document.createElement('button');
                editButton.className = 'secondary';
                editButton.type = 'button';
                editButton.textContent = 'Editar';
                editButton.addEventListener('click', () => startEditing(student));
                item.append(details, editButton, removeButton);
                return item;
            }));
            populateStudentSelectors(students);
            message.textContent = students.length ? '' : 'Nenhum aluno cadastrado.';
        } catch (error) {
            message.textContent = error.message;
        }

        function populateStudentSelectors(students) {
            const selectors = [
                document.querySelector('#charge-student'),
                document.querySelector('#finance-student-filter')
            ];
            selectors.forEach((select) => {
                if (!select) return;
                const selected = select.value;
                const emptyLabel = select.id === 'charge-student' ? 'Selecione um aluno' : 'Todos os alunos';
                select.replaceChildren(new Option(emptyLabel, ''));
                students.forEach((student) => {
                    select.append(new Option(`${student.nome} - ${student.escola}`, student.id));
                });
                select.value = selected;
            });
            populateRouteStudentSelector(students);
        }
    }

    let routeStudents = [];
    let routes = [];

    function routeMessage(text) {
        const message = document.querySelector('#route-message');
        if (message) message.textContent = text;
    }

    function populateRouteStudentSelector(students) {
        routeStudents = students;
        const selector = document.querySelector('#route-student-selector');
        if (!selector) return;
        selector.replaceChildren(new Option('Selecione um aluno', ''));
        students.forEach((student) => selector.append(
            new Option(`${student.nome} - ${student.escola}`, student.id)
        ));
    }

    async function loadRoutes() {
        const list = document.querySelector('#route-list');
        const selector = document.querySelector('#route-selector');
        if (!list || !selector) return;
        routeMessage('Carregando rotas...');
        try {
            routes = await window.apiClient.request('/api/rotas');
            const selected = selector.value;
            selector.replaceChildren(new Option('Selecione uma rota', ''));
            routes.forEach((route) => selector.append(
                new Option(`${route.nome} (${route.passageiros_count})`, route.id)
            ));
            selector.value = routes.some((route) => route.id === selected) ? selected : '';
            list.replaceChildren(...routes.map((route) => {
                const item = document.createElement('li');
                const details = document.createElement('span');
                details.textContent = `${route.nome} - ${route.descricao || 'Sem descrição'} (${route.passageiros_count} passageiros)`;
                const edit = document.createElement('button');
                edit.className = 'secondary';
                edit.type = 'button';
                edit.textContent = 'Editar';
                edit.addEventListener('click', () => startRouteEditing(route));
                const disable = document.createElement('button');
                disable.className = 'danger';
                disable.type = 'button';
                disable.textContent = 'Desativar';
                disable.addEventListener('click', () => disableRoute(route.id));
                item.append(details, edit, disable);
                return item;
            }));
            routeMessage(routes.length ? '' : 'Nenhuma rota ativa cadastrada.');
            if (selector.value) await loadRoutePassengers();
        } catch (error) {
            routeMessage(error.message);
        }
    }

    function startRouteEditing(route) {
        const form = document.querySelector('#route-form');
        form.nome.value = route.nome;
        form.descricao.value = route.descricao || '';
        form.dataset.editingId = route.id;
        form.querySelector('button[type="submit"]').textContent = 'Salvar rota';
        document.querySelector('#route-cancel-button').hidden = false;
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function cancelRouteEditing() {
        const form = document.querySelector('#route-form');
        delete form.dataset.editingId;
        form.reset();
        form.querySelector('button[type="submit"]').textContent = 'Criar rota';
        document.querySelector('#route-cancel-button').hidden = true;
    }

    async function disableRoute(routeId) {
        if (!window.confirm('Deseja desativar esta rota?')) return;
        try {
            await window.apiClient.request(`/api/rotas/${encodeURIComponent(routeId)}`, { method: 'DELETE' });
            routeMessage('Rota desativada com sucesso.');
            await loadRoutes();
        } catch (error) {
            routeMessage(error.message);
        }
    }

    async function loadRoutePassengers() {
        const routeId = document.querySelector('#route-selector')?.value;
        const list = document.querySelector('#route-passenger-list');
        const panel = document.querySelector('#route-passenger-panel');
        if (!routeId || !list || !panel) {
            if (panel) panel.hidden = true;
            return;
        }
        try {
            const passengers = await window.apiClient.request(`/api/rotas/${encodeURIComponent(routeId)}/alunos`);
            panel.hidden = false;
            list.replaceChildren(...passengers.map((passenger, index) => {
                const item = document.createElement('li');
                const details = document.createElement('span');
                details.textContent = `${index + 1}. ${passenger.aluno_nome} - ${passenger.escola || ''}`;
                const up = document.createElement('button');
                up.className = 'secondary';
                up.type = 'button';
                up.textContent = 'Subir';
                up.disabled = index === 0;
                up.addEventListener('click', () => reorderPassenger(passengers, index, -1));
                const down = document.createElement('button');
                down.className = 'secondary';
                down.type = 'button';
                down.textContent = 'Descer';
                down.disabled = index === passengers.length - 1;
                down.addEventListener('click', () => reorderPassenger(passengers, index, 1));
                const remove = document.createElement('button');
                remove.className = 'danger';
                remove.type = 'button';
                remove.textContent = 'Remover';
                remove.addEventListener('click', () => removeRoutePassenger(routeId, passenger.aluno_id));
                item.append(details, up, down, remove);
                return item;
            }));
        } catch (error) {
            routeMessage(error.message);
        }
    }

    async function reorderPassenger(passengers, index, offset) {
        const routeId = document.querySelector('#route-selector').value;
        const ids = passengers.map((passenger) => passenger.aluno_id);
        [ids[index], ids[index + offset]] = [ids[index + offset], ids[index]];
        try {
            await window.apiClient.request(`/api/rotas/${encodeURIComponent(routeId)}/alunos/ordem`, {
                method: 'PUT', body: JSON.stringify({ aluno_ids: ids })
            });
            await loadRoutePassengers();
            await loadRoutes();
        } catch (error) {
            routeMessage(error.message);
        }
    }

    async function removeRoutePassenger(routeId, studentId) {
        try {
            await window.apiClient.request(`/api/rotas/${encodeURIComponent(routeId)}/alunos/${encodeURIComponent(studentId)}`, { method: 'DELETE' });
            await loadRoutePassengers();
            await loadRoutes();
        } catch (error) {
            routeMessage(error.message);
        }
    }

    async function loadBoarding() {
        const routeId = document.querySelector('#route-selector')?.value;
        const date = document.querySelector('#boarding-date')?.value;
        const list = document.querySelector('#boarding-list');
        if (!routeId || !date || !list) return;
        try {
            const passengers = await window.apiClient.request(`/api/rotas/${encodeURIComponent(routeId)}/embarques?data=${encodeURIComponent(date)}`);
            list.replaceChildren(...passengers.map((passenger) => {
                const item = document.createElement('li');
                const details = document.createElement('span');
                details.textContent = `${passenger.aluno_nome} - ${passenger.escola || ''} | ${passenger.status}`;
                const controls = document.createElement('div');
                controls.className = 'boarding-status';
                ['Embarcou', 'Faltou', 'Não utilizará'].forEach((status) => {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.textContent = status;
                    button.className = passenger.status === status ? 'active' : '';
                    button.addEventListener('click', () => saveBoarding(passenger.aluno_id, status));
                    controls.append(button);
                });
                item.append(details, controls);
                return item;
            }));
        } catch (error) {
            routeMessage(error.message);
        }
    }

    async function saveBoarding(studentId, status) {
        const routeId = document.querySelector('#route-selector').value;
        const date = document.querySelector('#boarding-date').value;
        try {
            await window.apiClient.request(`/api/rotas/${encodeURIComponent(routeId)}/embarques/${encodeURIComponent(studentId)}`, {
                method: 'PUT', body: JSON.stringify({ data: date, status })
            });
            routeMessage('Embarque atualizado com sucesso.');
            await loadBoarding();
        } catch (error) {
            routeMessage(error.message);
        }
    }

    async function loadHistory() {
        const params = new URLSearchParams();
        const routeId = document.querySelector('#route-selector')?.value;
        const studentId = document.querySelector('#route-student-selector')?.value;
        const start = document.querySelector('#history-start')?.value;
        const end = document.querySelector('#history-end')?.value;
        if (routeId) params.set('rota_id', routeId);
        if (studentId) params.set('aluno_id', studentId);
        if (start) params.set('data_inicio', start);
        if (end) params.set('data_fim', end);
        const history = await window.apiClient.request(`/api/embarques?${params}`);
        const list = document.querySelector('#history-list');
        list.replaceChildren(...history.map((record) => {
            const item = document.createElement('li');
            const text = document.createElement('span');
            text.textContent = `${record.data_embarque} | ${record.aluno_nome} - ${record.status} | ${record.confirmado_em ? new Date(record.confirmado_em).toLocaleString('pt-BR') : 'sem confirmação'}`;
            item.append(text);
            return item;
        }));
        routeMessage(history.length ? '' : 'Nenhum embarque encontrado para os filtros.');
    }

    const routeForm = document.querySelector('#route-form');
    if (routeForm) {
        document.querySelector('#route-cancel-button').addEventListener('click', cancelRouteEditing);
        routeForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const editingId = routeForm.dataset.editingId;
            const payload = Object.fromEntries(new FormData(routeForm));
            try {
                await window.apiClient.request(editingId ? `/api/rotas/${encodeURIComponent(editingId)}` : '/api/rotas', {
                    method: editingId ? 'PUT' : 'POST', body: JSON.stringify(payload)
                });
                cancelRouteEditing();
                await loadRoutes();
            } catch (error) {
                routeMessage(error.message);
            }
        });
    }

    const routeStudentSelector = document.querySelector('#route-student-selector');
    if (routeStudentSelector) routeStudentSelector.addEventListener('focus', () => populateRouteStudentSelector(routeStudents));
    document.querySelector('#route-selector')?.addEventListener('change', async () => {
        await loadRoutePassengers();
        await loadBoarding();
    });
    document.querySelector('#add-route-student-button')?.addEventListener('click', async () => {
        const routeId = document.querySelector('#route-selector').value;
        const studentId = document.querySelector('#route-student-selector').value;
        try {
            await window.apiClient.request(`/api/rotas/${encodeURIComponent(routeId)}/alunos`, {
                method: 'POST', body: JSON.stringify({ aluno_id: studentId })
            });
            await loadRoutes();
        } catch (error) {
            routeMessage(error.message);
        }
    });
    document.querySelector('#load-boarding-button')?.addEventListener('click', loadBoarding);
    document.querySelector('#load-history-button')?.addEventListener('click', () => loadHistory().catch((error) => routeMessage(error.message)));
    document.querySelector('#route-refresh-button')?.addEventListener('click', loadRoutes);

    function startEditing(student) {
        const form = document.querySelector('#student-form');
        Object.keys(student).forEach((field) => {
            if (form.elements[field]) form.elements[field].value = student[field] ?? '';
        });
        form.dataset.editingId = student.id;
        document.querySelector('#form-title').textContent = 'Editar aluno';
        form.querySelector('button[type="submit"]').textContent = 'Salvar alterações';
        document.querySelector('#cancel-edit-button').hidden = false;
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function cancelEditing() {
        const form = document.querySelector('#student-form');
        delete form.dataset.editingId;
        form.reset();
        document.querySelector('#form-title').textContent = 'Cadastrar aluno';
        form.querySelector('button[type="submit"]').textContent = 'Cadastrar aluno';
        document.querySelector('#cancel-edit-button').hidden = true;
    }

    async function removeStudent(studentId) {
        if (!window.confirm('Deseja remover este aluno?')) return;

        const message = document.querySelector('#page-message');
        try {
            await window.apiClient.request(`/api/alunos/${encodeURIComponent(studentId)}`, {
                method: 'DELETE'
            });
            message.textContent = 'Aluno removido com sucesso.';
            await loadStudents();
        } catch (error) {
            message.textContent = error.message;
        }
    }

    const refreshButton = document.querySelector('#refresh-button');
    if (refreshButton) refreshButton.addEventListener('click', loadStudents);

    const studentForm = document.querySelector('#student-form');
    if (studentForm) {
        document.querySelector('#cancel-edit-button').addEventListener('click', cancelEditing);
        studentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const payload = Object.fromEntries(new FormData(studentForm));
            payload.valor = Number(payload.valor);
            payload.vencimento = Number(payload.vencimento);
            try {
                const editingId = studentForm.dataset.editingId;
                await window.apiClient.request(editingId ? `/api/alunos/${encodeURIComponent(editingId)}` : '/api/alunos', {
                    method: editingId ? 'PUT' : 'POST',
                    body: JSON.stringify(payload)
                });
                cancelEditing();
                await loadStudents();
            } catch (error) {
                document.querySelector('#page-message').textContent = error.message;
            }
        });
    }

    function financeQuery() {
        const params = new URLSearchParams();
        const studentId = document.querySelector('#finance-student-filter')?.value;
        const competence = document.querySelector('#finance-competence-filter')?.value;
        const status = document.querySelector('#finance-status-filter')?.value;
        if (studentId) params.set('aluno_id', studentId);
        if (competence) params.set('competencia', competence);
        if (status) params.set('status', status);
        const query = params.toString();
        return query ? `/api/mensalidades?${query}` : '/api/mensalidades';
    }

    function formatMoney(value) {
        return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function renderCharges(charges) {
        const list = document.querySelector('#charge-list');
        const message = document.querySelector('#finance-message');
        if (!list || !message) return;
        list.replaceChildren(...charges.map((charge) => {
            const item = document.createElement('li');
            const header = document.createElement('div');
            header.className = 'charge-header';
            const title = document.createElement('strong');
            title.textContent = `${charge.aluno_nome} - ${charge.competencia.slice(0, 7)}`;
            const status = document.createElement('span');
            status.className = `status status-${charge.status.toLowerCase()}`;
            status.textContent = charge.status;
            header.append(title, status);
            const details = document.createElement('span');
            details.textContent = `${formatMoney(charge.valor)} | Vencimento: dia ${charge.dia_vencimento}`;
            item.append(header, details);
            if (charge.status === 'Pago') {
                const payment = document.createElement('span');
                payment.textContent = `Pago em ${charge.data_pagamento} por ${formatMoney(charge.valor_pago)}${charge.pago_em_atraso ? ' (em atraso)' : ''}.`;
                item.append(payment);
            } else {
                const form = document.createElement('form');
                form.className = 'payment-form';
                form.innerHTML = `
                    <label>Data do pagamento<input name="data_pagamento" type="date" max="${new Date().toISOString().slice(0, 10)}" required></label>
                    <label>Valor recebido<input name="valor_pago" type="number" min="${charge.valor}" step="0.01" value="${charge.valor}" required></label>
                    <button type="submit">Marcar como pago</button>
                `;
                form.addEventListener('submit', (event) => payCharge(event, charge));
                item.append(form);
            }
            return item;
        }));
        message.textContent = charges.length ? '' : 'Nenhuma mensalidade encontrada.';
    }

    async function loadCharges() {
        const message = document.querySelector('#finance-message');
        if (!message || !window.apiClient) return;
        message.textContent = 'Carregando mensalidades...';
        try {
            const charges = await window.apiClient.request(financeQuery());
            renderCharges(charges);
        } catch (error) {
            message.textContent = error.message;
        }
    }

    async function payCharge(event, charge) {
        event.preventDefault();
        const form = event.currentTarget;
        const message = document.querySelector('#finance-message');
        const payload = Object.fromEntries(new FormData(form));
        payload.valor_pago = Number(payload.valor_pago);
        try {
            await window.apiClient.request(`/api/mensalidades/${encodeURIComponent(charge.id)}/pagamento`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            message.textContent = 'Pagamento registrado com sucesso.';
            await loadCharges();
        } catch (error) {
            message.textContent = error.message;
        }
    }

    const chargeForm = document.querySelector('#charge-form');
    if (chargeForm) {
        chargeForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const message = document.querySelector('#finance-message');
            const payload = Object.fromEntries(new FormData(chargeForm));
            payload.valor = Number(payload.valor);
            payload.dia_vencimento = Number(payload.dia_vencimento);
            try {
                await window.apiClient.request('/api/mensalidades', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                chargeForm.reset();
                message.textContent = 'Mensalidade registrada com sucesso.';
                await loadCharges();
            } catch (error) {
                message.textContent = error.message;
            }
        });
    }

    ['#finance-refresh-button', '#finance-student-filter', '#finance-competence-filter', '#finance-status-filter']
        .forEach((selector) => {
            const element = document.querySelector(selector);
            if (element) element.addEventListener('change', loadCharges);
        });
    const financeRefresh = document.querySelector('#finance-refresh-button');
    if (financeRefresh) financeRefresh.addEventListener('click', loadCharges);

    redirectForSession().then(() => {
        if (isProtectedPage) {
            loadStudents();
            loadCharges();
            const today = new Date().toISOString().slice(0, 10);
            const boardingDate = document.querySelector('#boarding-date');
            if (boardingDate) boardingDate.value = today;
            loadRoutes();
            loadHistory().catch((error) => routeMessage(error.message));
        }
    });
})();
