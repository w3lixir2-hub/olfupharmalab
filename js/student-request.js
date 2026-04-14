/**
 * Student Material Request - Form wizard and submission
 * Uses Supabase via supabase-data.js
 */
let currentStep = 1;
const totalSteps = 4;

/* ── Dropdown population ──────────────────────────────────── */

async function populateDropdowns() {
    const [sections, courses] = await Promise.all([getSections(), getCourses()]);

    const sectionSelect = document.getElementById('section');
    if (sectionSelect) {
        sectionSelect.innerHTML = '<option value="">Select Section</option>' +
            sections.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
    }

    const courseSelect = document.getElementById('course');
    if (courseSelect) {
        courseSelect.innerHTML = '<option value="">Select Course</option>' +
            courses.map(c => `<option value="${c.name}" data-id="${c.id}">${c.name}</option>`).join('');
    }

    await populateSubjectDropdown();
    await populateItemDropdowns();
}

async function populateSubjectDropdown() {
    const courseSelect = document.getElementById('course');
    const courseName = courseSelect ? courseSelect.value : '';
    const courses = await getCourses();
    const course = courses.find(c => c.name === courseName);
    const subjects = course ? await getSubjectsByCourse(course.id) : await getSubjects();

    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        subjectSelect.innerHTML = '<option value="">Select Subject</option>' +
            subjects.map(s => `<option value="${s.name}" data-id="${s.id}">${s.name}</option>`).join('');
    }
    await populateActivityDropdown();
    await populateInstructorDropdown();
}

async function populateActivityDropdown() {
    const subjectSelect = document.getElementById('subject');
    const subjectName = subjectSelect ? subjectSelect.value : '';
    const subjects = await getSubjects();
    const subject = subjects.find(s => s.name === subjectName);
    const experiments = subject ? await getExperimentsBySubject(subject.id) : await getExperiments();

    const activitySelect = document.getElementById('activity');
    if (activitySelect) {
        activitySelect.innerHTML = '<option value="">Select Experiment or Activity</option>' +
            experiments.map(e => `<option value="${e.name}">${e.name}</option>`).join('');
    }
}

async function populateInstructorDropdown() {
    const subjectSelect = document.getElementById('subject');
    const subjectName = subjectSelect ? subjectSelect.value : '';
    const subjects = await getSubjects();
    const subject = subjects.find(s => s.name === subjectName);
    const instructors = subject ? await getInstructorsBySubject(subject.id) : await getInstructors();

    const instructorSelect = document.getElementById('instructor');
    if (instructorSelect) {
        instructorSelect.innerHTML = '<option value="">Select Instructor</option>' +
            instructors.map(i => `<option value="${i.name}">${i.name}</option>`).join('');
    }
}

async function populateItemDropdowns() {
    const items = await getRequestItemsForDropdown();
    const opts = '<option value="" data-unit="">Select Item</option>' +
        items.map(it => `<option value="${it.name}" data-unit="${it.unit || 'pcs'}">${it.name} (${it.unit})</option>`).join('');

    document.querySelectorAll('.item-name').forEach(sel => {
        const currentVal = sel.value;
        sel.innerHTML = opts;
        if (currentVal) sel.value = currentVal;
    });
}

async function buildItemNameSelectHtml() {
    const items = await getRequestItemsForDropdown();
    return '<option value="">Select Item</option>' +
        items.map(it => `<option value="${it.name}" data-unit="${it.unit || 'pcs'}">${it.name} (${it.unit})</option>`).join('');
}

/* ── Step progress ────────────────────────────────────────── */

function updateProgress() {
    for (let i = 1; i <= totalSteps; i++) {
        const indicator = document.getElementById('step-' + i + '-indicator');
        const section   = document.getElementById('step-' + i);
        if (i < currentStep) {
            indicator.classList.add('completed'); indicator.classList.remove('active');
        } else if (i === currentStep) {
            indicator.classList.add('active'); indicator.classList.remove('completed');
        } else {
            indicator.classList.remove('active', 'completed');
        }
        section.classList.toggle('active', i === currentStep);
    }
    document.getElementById('prev-btn').style.display   = currentStep > 1 ? 'inline-flex' : 'none';
    document.getElementById('next-btn').style.display   = currentStep < totalSteps ? 'inline-flex' : 'none';
    document.getElementById('submit-btn').style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
}

/* ── Navigation ───────────────────────────────────────────── */

async function nextStep() {
    if (currentStep === 1) {
        const name      = document.getElementById('student-name').value.trim();
        const studentNum = document.getElementById('student-number').value.trim();
        const contact   = document.getElementById('contact-number').value.trim();
        const course    = document.getElementById('course').value;
        const yearLevel = document.getElementById('year-level').value;
        if (!name || !studentNum || !contact || !course || !yearLevel) {
            alert('Please fill in all required fields in Student Information.');
            return;
        }
    } else if (currentStep === 2) {
        const subject    = document.getElementById('subject').value;
        const activity   = document.getElementById('activity').value;
        const dateNeeded = document.getElementById('date-needed').value;
        const timeNeeded = document.getElementById('time-needed').value;
        const timeEnd    = document.getElementById('time-end').value;
        const instructor = document.getElementById('instructor').value;
        const room       = document.getElementById('room-assignment').value;
        if (!subject || !activity || !dateNeeded || !timeNeeded || !timeEnd || !instructor || !room) {
            alert('Please fill in all required fields in Request Details.');
            return;
        }
        if (timeEnd && timeNeeded && timeEnd <= timeNeeded) {
            alert('Time End must be after Time Start.');
            return;
        }
    } else if (currentStep === 3) {
        const requestType = document.getElementById('request-type').value;
        if (!requestType) {
            alert('Please select a Request Type.');
            return;
        }
        let hasValidItem = false;
        document.querySelectorAll('.item-row').forEach(item => {
            const name = (item.querySelector('.item-name')?.value || '').trim();
            const qty  = item.querySelector('.item-quantity')?.value;
            const unit = item.querySelector('.item-unit')?.value;
            if (name && qty && unit) hasValidItem = true;
        });
        if (!hasValidItem) {
            alert('Please add at least one item with complete details.');
            return;
        }
    }

    if (currentStep < totalSteps) {
        currentStep++;
        updateProgress();
        if (currentStep === 4) updateReviewSummary();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateProgress();
        if (currentStep !== 4) document.getElementById('print-btn').style.display = 'none';
    }
}

/* ── Submit ───────────────────────────────────────────────── */

async function submitForm() {
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const referenceNumber = `REQ-${now.getFullYear()}-${pad(now.getMonth()+1)}${pad(now.getDate())}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;

    const roomEl   = document.getElementById('room-assignment');
    const roomVal  = roomEl ? roomEl.value : '';
    const roomName = roomEl && roomEl.selectedIndex > 0 ? roomEl.options[roomEl.selectedIndex].text : '';

    const items = [];
    document.querySelectorAll('.item-row').forEach(item => {
        const name = (item.querySelector('.item-name')?.value || '').trim();
        const qty  = item.querySelector('.item-quantity')?.value;
        const unit = item.querySelector('.item-unit')?.value;
        if (name && qty && unit) items.push({ name, quantity: qty, unit });
    });

    const formData = {
        requestId:          referenceNumber,
        studentName:        document.getElementById('student-name').value.trim(),
        studentNumber:      document.getElementById('student-number').value.trim(),
        contactNumber:      document.getElementById('contact-number').value.trim(),
        course:             document.getElementById('course')?.value || '',
        yearLevel:          document.getElementById('year-level').value,
        section:            document.getElementById('section')?.value?.trim() || '',
        subject:            document.getElementById('subject')?.value?.trim() || '',
        activity:           document.getElementById('activity')?.value?.trim() || '',
        instructor:         document.getElementById('instructor')?.value?.trim() || '',
        dateNeeded:         document.getElementById('date-needed').value,
        timeNeeded:         document.getElementById('time-needed').value,
        timeEnd:            document.getElementById('time-end').value,
        roomAssignment:     roomVal,
        roomAssignmentName: roomName || 'AMS 204',
        requestType:        document.getElementById('request-type').value,
        remarks:            document.getElementById('remarks').value.trim(),
        items,
        status:             'pending',
        dateSubmitted:      new Date().toISOString(),
        laboratory:         roomName || 'AMS 204',
    };

    try {
        await saveRequest(formData);

        document.getElementById('review-summary').style.display  = 'none';
        document.getElementById('success-message').style.display = 'block';
        document.getElementById('prev-btn').style.display        = 'none';
        document.getElementById('submit-btn').style.display      = 'none';

        const refEl = document.getElementById('reference-number-display');
        if (refEl) refEl.textContent = referenceNumber;

        const trackLink = document.getElementById('track-link');
        if (trackLink) trackLink.href = 'student-dashboard.html?ref=' + encodeURIComponent(referenceNumber);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        console.error('Submit error:', err);
        alert('Error saving request: ' + (err.message || err));
        submitBtn.disabled = false;
        submitBtn.textContent = '✓ Submit Request';
    }
}

/* ── Print helpers ────────────────────────────────────────── */

function printSuccessPage() {
    const name        = document.getElementById('student-name').value.trim();
    const studentNum  = document.getElementById('student-number').value.trim();
    const course      = document.getElementById('course').value;
    const yearLevel   = document.getElementById('year-level').value;
    const section     = document.getElementById('section').value.trim();
    const subject     = document.getElementById('subject').value.trim();
    const activity    = document.getElementById('activity').value.trim();
    const instructor  = document.getElementById('instructor').value.trim();
    const dateNeeded  = document.getElementById('date-needed').value;
    const timeNeeded  = document.getElementById('time-needed').value;
    const timeEndVal  = document.getElementById('time-end').value;
    const refNumber   = document.getElementById('reference-number-display').textContent;
    const roomEl      = document.getElementById('room-assignment');
    const roomDisplay = roomEl && roomEl.selectedIndex > 0 ? roomEl.options[roomEl.selectedIndex].text : '-';

    let courseDisplay = course + (yearLevel ? ' - ' + yearLevel : '') + (section ? ', Section ' + section : '');

    function fmtDate(s) {
        if (!s) return '-';
        return new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    function fmtTime12(hhmm) {
        if (!hhmm) return '-';
        const [h, m] = hhmm.split(':');
        const hr = parseInt(h, 10);
        return ((hr % 12) || 12) + ':' + m + ' ' + (hr >= 12 ? 'PM' : 'AM');
    }

    let itemsHTML = '';
    document.querySelectorAll('.item-row').forEach(item => {
        const n = item.querySelector('.item-name').value.trim();
        const q = item.querySelector('.item-quantity').value;
        const u = item.querySelector('.item-unit').value;
        if (n && q && u) itemsHTML += `<tr><td style="padding:12px;">${n}</td><td style="text-align:right;padding:12px;">${q} ${u}</td></tr>`;
    });

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Request Confirmation - ${refNumber}</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:sans-serif;padding:40px;color:#2d3748;}
.header{text-align:center;margin-bottom:32px;border-bottom:2px solid #e2e8f0;padding-bottom:20px;}
.section{background:#f7fafc;padding:20px;border-radius:10px;margin-bottom:20px;}
.section h3{font-size:15px;font-weight:600;margin-bottom:12px;color:#2d3748;}
.section p{margin-bottom:6px;color:#4a5568;font-size:14px;}
.ref{background:#f7fafc;padding:14px;border-radius:8px;text-align:center;margin:20px 0;}
.ref-label{font-size:12px;color:#718096;margin-bottom:4px;}
.ref-value{font-size:22px;font-weight:700;color:#667eea;font-family:'Courier New',monospace;}
table{width:100%;border-collapse:collapse;}th{text-align:left;padding:10px;background:#f7fafc;font-size:12px;color:#718096;}
@media print{body{padding:20px;}}</style></head><body>
<div class="header"><div style="font-size:28px;font-weight:700;color:#667eea;">PharmaLab IMS</div>
<div style="font-size:16px;font-weight:600;margin-top:6px;">Request Confirmation</div>
<div class="ref"><div class="ref-label">Reference Number</div><div class="ref-value">${refNumber}</div></div></div>
<div class="section"><h3>Student Information</h3>
<p>Name: <strong>${name}</strong></p>
<p>Student Number: <strong>${studentNum}</strong></p>
<p>Course: <strong>${courseDisplay}</strong></p></div>
<div class="section"><h3>Request Details</h3>
<p>Subject: <strong>${subject}</strong></p>
<p>Activity: <strong>${activity}</strong></p>
<p>Instructor: <strong>${instructor}</strong></p>
<p>Date Needed: <strong>${fmtDate(dateNeeded)}</strong></p>
<p>Time: <strong>${fmtTime12(timeNeeded)} – ${fmtTime12(timeEndVal)}</strong></p>
<p>Room: <strong>${roomDisplay}</strong></p></div>
<div class="section"><h3>Requested Items</h3>
<table><thead><tr><th>Item</th><th style="text-align:right;">Qty</th></tr></thead>
<tbody>${itemsHTML || '<tr><td colspan="2" style="text-align:center;color:#a0aec0;">No items</td></tr>'}</tbody></table>
</div></body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); }, 250);
}

function printReviewSummary() { window.print(); }

/* ── Add item row ─────────────────────────────────────────── */

async function addItem() {
    const container = document.getElementById('items-container');
    const itemSelectHtml = await buildItemNameSelectHtml();
    const newItem = document.createElement('div');
    newItem.className = 'item-row';
    newItem.innerHTML =
        `<div class="form-group"><label class="form-label">Item Name <span class="required">*</span></label><select class="form-select item-name" required>${itemSelectHtml}</select></div>` +
        `<div class="form-group"><label class="form-label">Quantity <span class="required">*</span></label><input type="number" class="form-input item-quantity" placeholder="e.g., 500" min="1" required></div>` +
        `<div class="form-group"><label class="form-label">Unit <span class="required">*</span></label><select class="form-select item-unit" required><option value="mL">mL</option><option value="L">L</option><option value="g">g</option><option value="kg">kg</option><option value="pcs">pcs</option></select></div>` +
        `<button type="button" class="btn btn-remove" onclick="this.parentElement.remove()" title="Remove">✕</button>`;
    container.appendChild(newItem);
    newItem.querySelector('.item-name').addEventListener('change', function () {
        const unit = this.selectedOptions[0]?.dataset?.unit;
        const unitSel = newItem.querySelector('.item-unit');
        if (unit && unitSel) {
            if (!unitSel.querySelector(`option[value="${unit}"]`)) {
                const o = document.createElement('option');
                o.value = unit; o.textContent = unit;
                unitSel.appendChild(o);
            }
            unitSel.value = unit;
        }
    });
}

/* ── Review summary (step 4) ──────────────────────────────── */

function updateReviewSummary() {
    const name      = document.getElementById('student-name').value.trim() || '-';
    const studentNum = document.getElementById('student-number').value.trim() || '-';
    const contact   = document.getElementById('contact-number').value.trim() || '-';
    const course    = document.getElementById('course').value || '-';
    const yearLevel = document.getElementById('year-level').value || '-';
    const section   = document.getElementById('section').value?.trim() || '';

    document.getElementById('review-name').textContent          = name;
    document.getElementById('review-student-number').textContent = studentNum;
    document.getElementById('review-contact').textContent       = contact;
    document.getElementById('review-course').textContent        =
        course + (yearLevel !== '-' ? ' - ' + yearLevel : '') + (section ? ', Section ' + section : '');

    document.getElementById('review-subject').textContent    = document.getElementById('subject').value.trim()    || '-';
    document.getElementById('review-activity').textContent   = document.getElementById('activity').value.trim()   || '-';
    document.getElementById('review-instructor').textContent = document.getElementById('instructor').value.trim() || '-';

    const dateNeeded = document.getElementById('date-needed').value;
    document.getElementById('review-date').textContent = dateNeeded
        ? new Date(dateNeeded).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '-';

    function fmtTime(hhmm) {
        if (!hhmm) return '-';
        const [h, m] = hhmm.split(':');
        const hr = parseInt(h, 10);
        return ((hr % 12) || 12) + ':' + m + ' ' + (hr >= 12 ? 'PM' : 'AM');
    }
    document.getElementById('review-time').textContent     = fmtTime(document.getElementById('time-needed').value);
    document.getElementById('review-time-end').textContent = fmtTime(document.getElementById('time-end').value);

    const roomEl = document.getElementById('room-assignment');
    document.getElementById('review-room').textContent =
        roomEl && roomEl.selectedIndex > 0 ? roomEl.options[roomEl.selectedIndex].text : '-';

    const itemsTableBody = document.getElementById('items-table-body');
    itemsTableBody.innerHTML = '';
    let hasItems = false;
    document.querySelectorAll('.item-row').forEach(item => {
        const n = item.querySelector('.item-name').value.trim();
        const q = item.querySelector('.item-quantity').value;
        const u = item.querySelector('.item-unit').value;
        if (n && q && u) {
            hasItems = true;
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #e2e8f0';
            row.innerHTML = `<td style="padding:12px;color:#2d3748;">${n}</td><td style="text-align:right;padding:12px;color:#2d3748;">${q} ${u}</td>`;
            itemsTableBody.appendChild(row);
        }
    });
    if (!hasItems) itemsTableBody.innerHTML = '<tr><td colspan="2" style="padding:12px;color:#718096;text-align:center;">No items added yet</td></tr>';

    const remarks = document.getElementById('remarks').value.trim();
    const remarksReview = document.getElementById('remarks-review');
    if (remarks) { document.getElementById('review-remarks').textContent = remarks; remarksReview.style.display = 'block'; }
    else remarksReview.style.display = 'none';

    document.getElementById('print-btn').style.display = 'inline-flex';
}

/* ── Init ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', async function () {
    updateProgress();
    await populateDropdowns();

    document.getElementById('course')?.addEventListener('change', () => populateSubjectDropdown());
    document.getElementById('subject')?.addEventListener('change', () => {
        populateActivityDropdown();
        populateInstructorDropdown();
    });

    // Auto-set unit when item is selected
    document.getElementById('items-container')?.addEventListener('change', function (e) {
        if (!e.target.classList.contains('item-name')) return;
        const unit = e.target.selectedOptions?.[0]?.dataset?.unit;
        const row  = e.target.closest('.item-row');
        const unitSel = row?.querySelector('.item-unit');
        if (unit && unitSel) {
            if (!unitSel.querySelector(`option[value="${unit}"]`)) {
                const o = document.createElement('option');
                o.value = unit; o.textContent = unit;
                unitSel.appendChild(o);
            }
            unitSel.value = unit;
        }
    });
});
