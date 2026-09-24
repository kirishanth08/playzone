(function(){
  const modalEl = document.getElementById('actionModal');
  if(!modalEl || !window.bootstrap) return;
  const getModal = () => bootstrap.Modal.getOrCreateInstance(modalEl, {backdrop:true, keyboard:true, focus:true});
  const cleanup = () => {
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    document.body.style.removeProperty('overflow');
  };
  modalEl.addEventListener('hidden.bs.modal', cleanup);

  function modal(title, body, actions=''){
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = body;
    const foot = modalEl.querySelector('.modal-footer');
    foot.innerHTML = actions || '<button type="button" class="btn-primary-k" data-bs-dismiss="modal">Close</button>';
    const instance = getModal();
    if(!modalEl.classList.contains('show')) instance.show();
  }
  function rowData(btn){const tr=btn.closest('tr');return tr?Array.from(tr.cells).map(x=>x.innerText.trim()):[]}
  function formField(label,type,id,value=''){return `<div class="mb-3"><label class="form-label fw-semibold" for="${id}">${label}</label><input class="form-control" id="${id}" type="${type}" value="${value}"></div>`}

  document.addEventListener('click',function(e){
    const b=e.target.closest('button'); if(!b)return;
    if(['theme','rtl','notify'].includes(b.id)) return;

    if(b.id==='report'){
      e.preventDefault();e.stopImmediatePropagation();
      modal('Operations Report',`<p class="mb-3">Choose the report range and export a mock operations report.</p><div class="row g-3"><div class="col-md-6">${formField('From','date','reportFrom')}</div><div class="col-md-6">${formField('To','date','reportTo')}</div></div>`, '<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button type="button" class="btn-primary-k" id="downloadReport">Export CSV</button>');
      document.getElementById('downloadReport')?.addEventListener('click',()=>{const csv='Metric,Value\nRegistered Parents,1284\nWeekly Bookings,342\nMonthly Revenue,482000\nParty Requests,28';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='kidnest-operations-report.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);});
      return;
    }

    if(b.classList.contains('view')){
      e.preventDefault();e.stopImmediatePropagation();const d=rowData(b);
      modal('Parent / Child Profile',`<div class="profile-pop"><div class="stat-card mb-3"><div class="stat-num">${d[0]||'Profile'}</div><div class="muted">${d.slice(1,4).join(' · ')}</div></div><p>Account details, contact information, linked children, booking history and membership status.</p></div>`,'<button type="button" class="btn btn-outline-danger" id="suspend">Suspend</button><button type="button" class="btn-primary-k" data-bs-dismiss="modal">Close</button>');
      document.getElementById('suspend')?.addEventListener('click',()=>modal('Account suspended','The selected account is now marked as suspended in mock data.','<button type="button" class="btn-primary-k" data-bs-dismiss="modal">Done</button>'));return;
    }

    if(b.classList.contains('action')){
      e.preventDefault();e.stopImmediatePropagation();const d=rowData(b);
      modal('Manage Booking',`<p><strong>${d[1]||'Parent'}</strong> · ${d[2]||'Child'} · ${d[3]||'Zone'}</p><div class="row g-3"><div class="col-md-6">${formField('Reschedule date','date','resDate')}</div><div class="col-md-6"><label class="form-label fw-semibold">Status</label><select class="form-select" id="bookingStatus"><option>Confirmed</option><option>Pending</option><option>Cancelled</option></select></div></div>`, '<button type="button" class="btn btn-outline-danger" id="cancelBooking">Cancel booking</button><button type="button" class="btn-primary-k" id="saveBooking">Save changes</button>');
      document.getElementById('saveBooking')?.addEventListener('click',()=>modal('Booking updated','The booking status and schedule were updated in mock data.','<button type="button" class="btn-primary-k" data-bs-dismiss="modal">Done</button>'));
      document.getElementById('cancelBooking')?.addEventListener('click',()=>modal('Booking cancelled','The booking has been marked as cancelled in mock data.','<button type="button" class="btn-primary-k" data-bs-dismiss="modal">Done</button>'));return;
    }

    if(b.classList.contains('edit')){
      e.preventDefault();e.stopImmediatePropagation();
      modal('Edit Membership',`${formField('Plan name','text','planName','Adventure+')}<div class="row g-3"><div class="col-md-6">${formField('Price','number','planPrice','2499')}</div><div class="col-md-6">${formField('Sessions','number','planSessions','12')}</div></div><div class="form-check mb-3"><input class="form-check-input" type="checkbox" id="planActive" checked><label class="form-check-label" for="planActive">Plan active</label></div>`, '<button type="button" class="btn-primary-k" id="savePlan">Save plan</button>');
      document.getElementById('savePlan')?.addEventListener('click',()=>modal('Membership updated','Plan details were saved successfully in mock data.','<button type="button" class="btn-primary-k" data-bs-dismiss="modal">Done</button>'));return;
    }

    if(b.id==='newPlan'){
      e.preventDefault();e.stopImmediatePropagation();
      modal('Create Membership Plan',`${formField('Plan name','text','newPlanName')}<div class="row g-3"><div class="col-md-6">${formField('Monthly price','number','newPrice')}</div><div class="col-md-6">${formField('Sessions','number','newSessions')}</div></div>`, '<button type="button" class="btn-primary-k" id="createPlan">Create plan</button>');
      document.getElementById('createPlan')?.addEventListener('click',()=>modal('Plan created','The new membership plan has been added to the mock plan list.','<button type="button" class="btn-primary-k" data-bs-dismiss="modal">Done</button>'));return;
    }

    if(b.classList.contains('reply')){
      e.preventDefault();e.stopImmediatePropagation();const d=rowData(b);
      modal('Reply to Parent',`<div class="mb-3"><strong>${d[0]||'Parent'}</strong><div class="small muted">Conversation thread</div></div><textarea class="form-control" id="replyText" rows="5" placeholder="Write your reply..."></textarea>`, '<button type="button" class="btn-primary-k" id="sendReply">Send reply</button>');
      document.getElementById('sendReply')?.addEventListener('click',()=>{if(!document.getElementById('replyText').value.trim())return;modal('Reply sent','Your response has been added to the conversation in mock data.','<button type="button" class="btn-primary-k" data-bs-dismiss="modal">Done</button>');});return;
    }

    if(b.classList.contains('party')||b.id==='addParty'){
      e.preventDefault();e.stopImmediatePropagation();
      modal(b.id==='addParty'?'Create Party Booking':'Party Request',`${formField('Parent name','text','partyParent',b.id==='addParty'?'':'Priya Sharma')}<div class="row g-3"><div class="col-md-6">${formField('Event date','date','partyDate')}</div><div class="col-md-6">${formField('Guests','number','partyGuests','12')}</div></div><div class="mb-3"><label class="form-label fw-semibold">Package</label><select class="form-select" id="partyPackage"><option>Mini Explorers</option><option>Adventure Blast</option><option>Ultimate Celebration</option></select></div>`, '<button type="button" class="btn-primary-k" id="saveParty">Save booking</button>');
      document.getElementById('saveParty')?.addEventListener('click',()=>modal('Party booking saved','The event has been added to the mock party schedule.','<button type="button" class="btn-primary-k" data-bs-dismiss="modal">Done</button>'));return;
    }

    if(b.classList.contains('msg')){
      e.preventDefault();e.stopImmediatePropagation();
      modal('Message Inbox',`<div class="list-group"><button type="button" class="list-group-item list-group-item-action">Unread parent messages <span class="badge bg-danger float-end">12</span></button><button type="button" class="list-group-item list-group-item-action">Contact enquiries <span class="badge bg-warning text-dark float-end">4</span></button></div>`,'<button type="button" class="btn-primary-k" data-bs-dismiss="modal">Close</button>');return;
    }
  },true);

  // Admin Mobile Sidebar Drawer Setup
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    let backdrop = document.querySelector('.sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }

    const topbar = document.querySelector('.topbar');
    if (topbar && !topbar.querySelector('#sidebarToggle, .sidebar-toggle-btn')) {
      const firstChild = topbar.firstElementChild;
      if (firstChild && !firstChild.classList.contains('top-actions')) {
        const wrap = document.createElement('div');
        wrap.className = 'topbar-left d-flex align-items-center gap-2';

        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'icon-btn sidebar-toggle-btn';
        toggleBtn.id = 'sidebarToggle';
        toggleBtn.setAttribute('aria-label', 'Toggle Navigation');
        toggleBtn.setAttribute('title', 'Open Menu');
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';

        const backBtn = document.createElement('a');
        backBtn.className = 'icon-btn topbar-back-btn';
        backBtn.href = 'index.html';
        backBtn.setAttribute('aria-label', 'Back to Website');
        backBtn.setAttribute('title', 'Back to Website');
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';

        firstChild.parentNode.insertBefore(wrap, firstChild);
        wrap.appendChild(toggleBtn);
        wrap.appendChild(backBtn);
        wrap.appendChild(firstChild);
      }
    }

    const brand = sidebar.querySelector('.brand');
    if (brand && !brand.querySelector('.sidebar-close-btn')) {
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'icon-btn sidebar-close-btn';
      closeBtn.id = 'sidebarClose';
      closeBtn.setAttribute('aria-label', 'Close Sidebar');
      closeBtn.setAttribute('title', 'Close Menu');
      closeBtn.innerHTML = '<i class="fas fa-xmark"></i>';
      brand.appendChild(closeBtn);
    }

    function openSidebar() {
      sidebar.classList.add('show');
      backdrop.classList.add('show');
      document.body.classList.add('sidebar-open');
    }

    function closeSidebar() {
      sidebar.classList.remove('show');
      backdrop.classList.remove('show');
      document.body.classList.remove('sidebar-open');
    }

    document.addEventListener('click', function (e) {
      const toggle = e.target.closest('#sidebarToggle, .sidebar-toggle-btn');
      if (toggle) {
        e.preventDefault();
        e.stopPropagation();
        if (sidebar.classList.contains('show')) closeSidebar();
        else openSidebar();
        return;
      }

      const close = e.target.closest('#sidebarClose, .sidebar-close-btn');
      if (close) {
        e.preventDefault();
        e.stopPropagation();
        closeSidebar();
        return;
      }

      if (e.target === backdrop) {
        closeSidebar();
        return;
      }

      const link = e.target.closest('.sidebar .side-link');
      if (link && window.innerWidth < 992) {
        setTimeout(closeSidebar, 150);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('show')) {
        closeSidebar();
      }
    });
  }
})();

