// ===== TAB NAVIGATION =====
const tabButtons = document.querySelectorAll('.tab-btn');
const inputSections = document.querySelectorAll('.input-section');
const navButtons = document.querySelectorAll('.btn-nav');

function navigateToPart(part) {
    // Remove active class from all tabs and sections
    tabButtons.forEach(btn => btn.classList.remove('active'));
    inputSections.forEach(section => section.classList.remove('active'));
    
    // Add active class to the target tab and section
    document.querySelector(`.tab-btn[data-part="${part}"]`).classList.add('active');
    document.getElementById(`part${part}-inputs`).classList.add('active');
}

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        navigateToPart(button.dataset.part);
    });
});

navButtons.forEach(button => {
    button.addEventListener('click', () => navigateToPart(button.dataset.target));
});

// ===== REAL-TIME PREVIEW UPDATES =====
function updatePreview(inputId, previewId, prefix = '', suffix = '', defaultText = '') {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (input && preview) {
        const update = () => {
            // Special handling for the recommendation field
            if (inputId === 'recommendation') {
                const hardcodedText = "Recommended technically for purchase of equipment for the patient after the final approval by ";
                preview.textContent = hardcodedText + input.value;
            } else if (input.value) {
                preview.textContent = prefix + input.value + suffix;
            } else {
                preview.textContent = defaultText;
            }
        };

        input.addEventListener('input', update);
        input.addEventListener('change', update); // Add change listener for selects

        // The initial call is now handled by loadFormState to ensure correct order
    }
}

// Hospital Name update
document.getElementById('hospitalName').addEventListener('input', () => {
    document.getElementById('preview-hospitalName').textContent = document.getElementById('hospitalName').value;
});

// Part 2 updates
updatePreview('hearingTestDate', 'preview-hearingTestDate', '', '', 'Date');
updatePreview('audiologistName', 'preview-audiologistName', '', '', 'Audiologist Name');
updatePreview('complaint1', 'preview-complaint1', '', '', 'Yes/No');
updatePreview('complaint2', 'preview-complaint2', '', '', 'Yes/No');
updatePreview('complaint3', 'preview-complaint3', '', '', 'Yes/No');
updatePreview('earAffected', 'preview-earAffected', '', '', 'Ear(s)');

// Part 4 updates
updatePreview('selectedModel', 'preview-selectedModel', '', '', 'Model');
updatePreview('selectedSupplier', 'preview-selectedSupplier', '', '', 'Supplier');
updatePreview('mrp', 'preview-mrp', '', '', 'MRP');
updatePreview('discountPrice', 'preview-discountPrice', '', '', 'Discount Price');
updatePreview('warranty', 'preview-warranty', '', '', 'Yrs');

// Special setup for recommendation to handle appending text
updatePreview('recommendation', 'preview-recommendation', '', '', 'Recommendation Statement');

// Part 5 updates
updatePreview('station', 'preview-station', '', '', 'Station');
updatePreview('consentDate', 'preview-consentDate', '', '', 'Date');
updatePreview('procurementPreference', 'preview-procurementPreference', '', '', 'unwilling'); // For saving/loading
updatePreview('doctor1Name', 'preview-doctor1Name', '', '', 'Doctor 1 Name');
updatePreview('doctor1Rank', 'preview-doctor1Rank', '', '', 'Rank & Designation');
updatePreview('doctor2Name', 'preview-doctor2Name', '', '', 'Doctor 2 Name');
updatePreview('doctor2Rank', 'preview-doctor2Rank', '', '', 'Rank & Designation');
updatePreview('prevIssueDate', 'serving-cert-prev-date', '', '', 'Date of Previous Issue');
updatePreview('prevModelName', 'serving-cert-prev-model', '', '', 'Previous Model Name');

// Part 1 updates that are not handled by other specific functions
updatePreview('patientName', 'preview-patientName', '', '', 'Patient Name');
updatePreview('relation', 'preview-relation', '', '', 'Relation');
updatePreview('relatedName', 'preview-relatedName', '', '', 'Related Person Name');
updatePreview('echsPolyclinic', 'preview-echsPolyclinic', '', '', 'Polyclinic');
updatePreview('contactNo', 'preview-contactNo', '', '', 'Contact No');



// Update sex in age field
document.getElementById('sex').addEventListener('change', function() {
    document.getElementById('age').dispatchEvent(new Event('input'));
});

document.getElementById('age').addEventListener('input', function() {
    const ageSpan = document.getElementById('preview-age');
    const age = this.value;
    const sex = document.getElementById('sex').value;
    const ageText = age || 'Age';
    const sexText = sex || 'Sex';
    ageSpan.textContent = `${ageText} Yrs / ${sexText}`;
});

// ===== DYNAMIC IDENTIFICATION FIELDS (ECHS Card No / Service Number) =====
let currentIdType = 'ECHS Card No'; // Default

function updateIdentificationFields() {
    const relationSelect = document.getElementById('relation');
    const serviceTypeSelect = document.getElementById('serviceType');
    currentIdType = serviceTypeSelect.value === 'Serving' ? 'Service Number' : 'ECHS Card No';

    // Input field labels and placeholders
    const echsCardNoLabel = document.getElementById('echsCardNoLabel');
    const echsCardNoInput = document.getElementById('echsCardNo');
    const relatedCardNoLabel = document.getElementById('relatedCardNoLabel');
    const rankInput = document.getElementById('rank');
    const relatedCardNoInput = document.getElementById('relatedCardNo');
    const relatedCardNoGroup = document.getElementById('relatedCardNoGroup');
    const relatedNameInput = document.getElementById('relatedName');
    const servingIssueOptions = document.getElementById('serving-issue-options');
    const relatedPersonRow = document.getElementById('related-person-row'); // The TR in the report preview
    const exServingCerts = document.getElementById('ex-serving-certs');
    const servingCertContainer = document.getElementById('serving-cert-container');
    const polyclinicLabel = document.getElementById('echsPolyclinicLabel');
    const polyclinicInput = document.getElementById('echsPolyclinic');
    const previewPolyclinicLabel = document.getElementById('preview-echsPolyclinicLabel');


    if (echsCardNoLabel) echsCardNoLabel.textContent = currentIdType;
    if (echsCardNoInput) echsCardNoInput.placeholder = currentIdType;
    if (relatedCardNoLabel) relatedCardNoLabel.textContent = `Related Person ${currentIdType}`;
    if (relatedCardNoInput) relatedCardNoInput.placeholder = currentIdType;

    // Preview labels and values
    const previewEchsCardNoLabel = document.getElementById('preview-echsCardNoLabel');
    const previewEchsCardNo = document.getElementById('preview-echsCardNo');
    const previewRelatedCardNoLabel = document.getElementById('preview-relatedCardNoLabel');
    const previewRelatedCardNo = document.getElementById('preview-relatedCardNo');
    const previewRank = document.getElementById('preview-rank');

    const isServing = serviceTypeSelect.value === 'Serving';
    const isSelf = relationSelect.value === 'Self';

    // Toggle visibility of Rank input and certificate types
    servingIssueOptions.style.display = isServing ? 'block' : 'none';
    exServingCerts.style.display = isServing ? 'none' : 'block';
    servingCertContainer.style.display = isServing ? 'block' : 'none';

    // Control visibility of Related Person fields (both input and preview)
    // Hide if service type is Serving OR if relation is Self
    if (isServing || isSelf) {
        relatedCardNoGroup.style.display = 'none';
        relatedPersonRow.style.display = 'none';
        relatedNameInput.value = ''; // Clear input values
        relatedCardNoInput.value = '';
        document.getElementById('preview-relatedName').textContent = ''; // Clear preview values
        document.getElementById('preview-relatedCardNo').textContent = '';
        document.getElementById('preview-relatedCardNoLabel').textContent = ''; // Clear preview label
        if (polyclinicLabel) polyclinicLabel.textContent = 'Unit';
        if (polyclinicInput) polyclinicInput.placeholder = 'Enter Unit';
        if (previewPolyclinicLabel) previewPolyclinicLabel.textContent = 'Unit';
    } else {
        relatedCardNoGroup.style.display = 'block';
        relatedPersonRow.style.display = ''; // Show the row
        if (polyclinicLabel) polyclinicLabel.textContent = 'ECHS Polyclinic';
        if (polyclinicInput) polyclinicInput.placeholder = 'Polyclinic City';
        if (previewPolyclinicLabel) previewPolyclinicLabel.textContent = 'ECHS Polyclinic';
    }

    if (previewEchsCardNoLabel) previewEchsCardNoLabel.textContent = currentIdType;
    if (previewEchsCardNo) {
        previewEchsCardNo.textContent = echsCardNoInput.value || '';
    }
    if (previewRelatedCardNoLabel && !isServing && !isSelf) { // Only update if visible
        previewRelatedCardNoLabel.textContent = currentIdType;
        previewRelatedCardNo.textContent = relatedCardNoInput.value || '';
    }
    if (previewRank) {
        previewRank.textContent = rankInput.value || ''; // No placeholder, just empty
    }
    // Also update rank in serving cert
    updateServingCertificate();

    // Trigger updates for consent/certificates that use the dynamic text
    updateConsentStatement();
    updateCertificates();
    updateServingCertificate();
}

// Event listeners for dynamic ID fields
document.getElementById('serviceType').addEventListener('change', updateIdentificationFields);
document.getElementById('rank').addEventListener('input', updateIdentificationFields);
document.getElementById('relation').addEventListener('change', updateIdentificationFields); // Relation now triggers this
document.getElementById('echsCardNo').addEventListener('input', updateIdentificationFields);
document.getElementById('relatedCardNo').addEventListener('input', updateIdentificationFields);

// Update consent statement dynamically
function updateConsentStatement() {
    const preference = document.getElementById('procurementPreference').value;
    const statementEl = document.getElementById('preview-consentStatement');

    const name = document.getElementById('patientName').value || 'Patient Name';
    const cardNo = document.getElementById('echsCardNo').value || 'Card No';
    const relation = document.getElementById('relation').value || 'relation';
    const relatedName = document.getElementById('relatedName').value || 'Related Person';
    const relatedCard = document.getElementById('relatedCardNo').value || 'Card No';
    const isSelf = relation === 'Self';

    let relationText = '';
    if (!isSelf) {
        const relationPrefix = relation === 'Spouse' ? 'w/o' : 
                              relation === 'Father' ? 's/o' :
                              relation === 'Mother' ? 'd/o' : 'c/o';
        relationText = ` ${relationPrefix} <strong>${relatedName}</strong> ${currentIdType} <strong>${relatedCard}</strong>`;
    }

    let statement = '';
    if (preference === 'willing') {
        const warrantyNum = document.getElementById('warranty').value;
        const warrantyWordsForConsent = numberToWords(warrantyNum).replace(' only', '') || 'Yrs';

        statement = `"I, <strong>${name}</strong> (${currentIdType} <strong>${cardNo}</strong>${relationText}), hereby acknowledge that I have been provided with hearing aid trial and have selected the hearing aid based on my selection preference. I understand the terms of purchase, warranty (<strong>${warrantyWordsForConsent}</strong> years), annual retuning schedule and home care as explained by the supplier."`;
    } else {
        // Unwilling
        statement = `“I, <strong>${name}</strong> (${currentIdType} <strong>${cardNo}</strong>)${relationText}, hereby affirm that I have been provided with hearing aid trial and have selected the hearing aid based on my requirements, but I am unwilling to buy hearing aids on my own and not willing to choose for reimbursement later. You are therefore requested to procure it from your end as per ECHS procurement guidelines and issue me the same from the polyclinic.”`;
    }
    statementEl.innerHTML = statement;
}

['patientName', 'echsCardNo', 'relation', 'relatedName', 'relatedCardNo', 'warranty', 'procurementPreference'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', updateConsentStatement);
        element.addEventListener('change', updateConsentStatement);
    }
});
updateConsentStatement(); // Initial call

// Update Part 6 Certificates
function updateCertificates() {
    const name = document.getElementById('patientName').value || 'Patient Name';
    const cardNo = document.getElementById('echsCardNo').value || 'Card No';
    const relation = document.getElementById('relation').value;
    const relatedName = document.getElementById('relatedName').value || 'Related Person';
    const relatedCard = document.getElementById('relatedCardNo').value || 'Card No';
    const isSelf = relation === 'Self';

    let relationText = '';
    if (!isSelf) {
        const relationPrefix = relation === 'Spouse' ? 'w/o' : 
                              relation === 'Father' ? 's/o' :
                              relation === 'Mother' ? 'd/o' : 'c/o';
        relationText = `${relation} ${relatedName} ${currentIdType} ${relatedCard}`;
    } else {
        relationText = `Self`;
    }

    // Certificate 1
    document.getElementById('cert-patientName').textContent = name;
    document.getElementById('cert-echsCardNo').textContent = `${currentIdType} ${cardNo}`;
    document.getElementById('cert-relationInfo').textContent = relationText;

    // Certificate 2
    document.getElementById('cert2-patientName').textContent = name;
    document.getElementById('cert2-echsCardNo').textContent = `${currentIdType} ${cardNo}`;
    document.getElementById('cert2-relationInfo').textContent = relationText;
}

['patientName', 'echsCardNo', 'relation', 'relatedName', 'relatedCardNo'].forEach(id => document.getElementById(id).addEventListener('input', updateCertificates));
updateCertificates(); // Initial call

// Update Serving Certificate (Part 6)
function updateServingCertificate() {
    const name = document.getElementById('patientName').value || 'Patient Name';
    const rank = document.getElementById('rank').value || 'Rank';
    const serviceNo = document.getElementById('echsCardNo').value || 'Service No';
    const relation = document.getElementById('relation').value;
    const depName = (relation === 'Self') ? name : (document.getElementById('relatedName').value || 'Dependent Name');
    const depAge = document.getElementById('age').value || 'Age';
    const earAffected = document.getElementById('earAffected').value;

    const relationMap = {
        'Self': 'Self', 'Spouse': 'Wife', 'Father': 'Father', 
        'Mother': 'Mother', 'Child': 'Son/Daughter'
    };
    const relationText = relationMap[relation] || 'Dependent';

    // Populate fields for both certs
    ['', '2'].forEach(suffix => {
        document.getElementById(`serving-cert-id${suffix}`).textContent = serviceNo;
        document.getElementById(`serving-cert-rank${suffix}`).textContent = rank;
        document.getElementById(`serving-cert-name${suffix}`).textContent = name;
        document.getElementById(`serving-cert-relation${suffix}`).textContent = relationText;
        document.getElementById(`serving-cert-dep-name${suffix}`).textContent = depName;
        document.getElementById(`serving-cert-dep-age${suffix}`).textContent = depAge;
    });
    document.getElementById('serving-cert-ear').textContent = earAffected;

    // Toggle visibility of First Time vs Subsequent Issue sections
    const issueType = document.getElementById('issueType').value;
    document.getElementById('first-time-issue-cert').style.display = (issueType === 'First Time') ? 'block' : 'none';
    document.getElementById('subsequent-issue-cert').style.display = (issueType === 'Subsequent') ? 'block' : 'none';
    document.getElementById('subsequent-issue-details').style.display = (issueType === 'Subsequent') ? 'block' : 'none';
}

['age', 'earAffected', 'issueType', 'prevIssueDate', 'prevModelName'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', updateServingCertificate);
        el.addEventListener('change', updateServingCertificate);
    }
});
updateServingCertificate(); // Initial call

// Disable related person fields if relation is 'Self'
const relationSelect = document.getElementById('relation');
const relatedNameInput = document.getElementById('relatedName');
const relatedCardNoInput = document.getElementById('relatedCardNo');
const relatedPersonRow = document.getElementById('related-person-row');

function handleRelationChange() {
    const isSelf = relationSelect.value === 'Self';
    relatedNameInput.disabled = isSelf;
    relatedCardNoInput.disabled = isSelf;
    relatedPersonRow.style.display = isSelf ? 'none' : ''; // Use empty string to revert to stylesheet default

    if (isSelf) {
        relatedNameInput.value = '';
        relatedCardNoInput.value = '';
        // Manually trigger input events to update preview and save state
        relatedNameInput.dispatchEvent(new Event('input'));
        relatedCardNoInput.dispatchEvent(new Event('input'));
        // updateIdentificationFields() is already called by the input event, so this is not needed.
    }
}

relationSelect.addEventListener('change', handleRelationChange);
// Initial check on load is handled by loadFormState and its subsequent event dispatches.

// ===== AUDIOGRAM PROCESSING =====
let audiogramData = {
    right: { ac: {}, bc: {} },
    left: { ac: {}, bc: {} }
};

// Collect audiogram data
function collectAudiogramData() {
    const frequencies = [250, 500, 1000, 2000, 4000, 8000];
    
    // Right ear
    frequencies.forEach(freq => {
        const acInput = document.querySelector(`.ac-right[data-freq="${freq}"]`);
        const bcInput = document.querySelector(`.bc-right[data-freq="${freq}"]`);
        
        audiogramData.right.ac[freq] = acInput && acInput.value ? parseFloat(acInput.value) : null;
        audiogramData.right.bc[freq] = bcInput && bcInput.value ? parseFloat(bcInput.value) : null;
    });
    
    // Left ear
    frequencies.forEach(freq => {
        const acInput = document.querySelector(`.ac-left[data-freq="${freq}"]`);
        const bcInput = document.querySelector(`.bc-left[data-freq="${freq}"]`);
        
        audiogramData.left.ac[freq] = acInput && acInput.value ? parseFloat(acInput.value) : null;
        audiogramData.left.bc[freq] = bcInput && bcInput.value ? parseFloat(bcInput.value) : null;
    });
    
    calculateDiagnosis();
    drawAudiogram();
}

// Calculate average and diagnosis
function calculateDiagnosis() {
    const frequenciesForAverage = ['500', '1000', '2000', '4000'];

    const getAverage = (data) => {
        const values = frequenciesForAverage
            .map(freq => data[freq])
            .filter(v => v !== null && v !== undefined);
        
        return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
    };

    // Calculate averages for right ear
    const rightAcAvg = getAverage(audiogramData.right.ac);
    const rightBcAvg = getAverage(audiogramData.right.bc);
    
    // Calculate averages for left ear
    const leftAcAvg = getAverage(audiogramData.left.ac);
    const leftBcAvg = getAverage(audiogramData.left.bc);
    
    // Update preview
    document.getElementById('preview-acRight').textContent = rightAcAvg;
    document.getElementById('preview-bcRight').textContent = rightBcAvg;
    document.getElementById('preview-acLeft').textContent = leftAcAvg;
    document.getElementById('preview-bcLeft').textContent = leftBcAvg;
    
    // Determine diagnosis
      const rightSeverity = getSeverityDiagnosis(rightAcAvg);
    const leftSeverity = getSeverityDiagnosis(leftAcAvg);

    // Get manual hearing loss type for each ear
    const hearingLossTypeRight = document.getElementById('hearingLossTypeRight').value;
    const typeTextRight = hearingLossTypeRight ? ` (${hearingLossTypeRight})` : '';

    const hearingLossTypeLeft = document.getElementById('hearingLossTypeLeft').value;
    const typeTextLeft = hearingLossTypeLeft ? ` (${hearingLossTypeLeft})` : '';
    
    document.getElementById('preview-diagnosisRight').textContent = rightSeverity + typeTextRight;
    document.getElementById('preview-diagnosisLeft').textContent = leftSeverity + typeTextLeft;
}

function getSeverityDiagnosis(ac) {
    let severity = '';
   
    
    // Determine severity based on AC
    if (ac <= 20) severity = 'Within Normal Limits';
   else if (ac >= 21 && ac <= 40) severity = 'Mild Hearing Loss';
    else if (ac >= 41 && ac <= 60) severity = 'Moderate Hearing Loss';
    else if (ac >= 61 && ac <= 80) severity = 'Severe Hearing Loss';
    else if (ac >= 81 && ac <= 100) severity = 'Severely Profound Hearing Loss';
    else if (ac >= 101 && ac <= 120) severity = 'Profound Hearing Loss';
    else severity = 'Profound Hearing Loss'; // For values > 120dB
    
    return severity;
}

// Draw audiogram chart
function drawAudiogram() {
    const canvas = document.getElementById('audiogramCanvas');
    const ctx = canvas.getContext('2d');
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, width, height);
    
    const frequencies = [250, 500, 1000, 2000, 4000, 8000];
    const dbLevels = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
    
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Draw grid
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // Vertical lines (frequencies)
    frequencies.forEach((freq, i) => {
        const x = padding + (i / (frequencies.length - 1)) * chartWidth;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
        
        // Frequency labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText(freq + ' Hz', x, height - padding + 20);
    });
    
    // Horizontal lines (dB levels)
    dbLevels.forEach((db, i) => {
        const y = padding + (i / (dbLevels.length - 1)) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        // dB labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Segoe UI';
        ctx.textAlign = 'right';
        ctx.fillText(db + ' dB', padding - 10, y + 4);
    });
    
    // Draw data points
    function drawPoints(data, color, symbol) {
        const points = [];
        frequencies.forEach((freq, i) => {
            const db = data[freq];
            if (db !== null && db !== undefined) {
                const x = padding + (i / (frequencies.length - 1)) * chartWidth;
                const y = padding + ((db + 10) / 130) * chartHeight;
                points.push({ x, y, freq });
                
                // Draw symbol
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.lineWidth = 2;
                
                if (symbol === 'circle') {
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, Math.PI * 2);
                    ctx.stroke();
                } else if (symbol === 'cross') {
                    ctx.beginPath();
                    ctx.moveTo(x - 5, y - 5);
                    ctx.lineTo(x + 5, y + 5);
                    ctx.moveTo(x + 5, y - 5);
                    ctx.lineTo(x - 5, y + 5);
                    ctx.stroke();
                } else if (symbol === '<') {
                    ctx.beginPath();
                    ctx.moveTo(x + 5, y - 5);
                    ctx.lineTo(x - 5, y);
                    ctx.lineTo(x + 5, y + 5);
                    ctx.stroke();
                } else if (symbol === '>') {
                    ctx.beginPath();
                    ctx.moveTo(x - 5, y - 5);
                    ctx.lineTo(x + 5, y);
                    ctx.lineTo(x - 5, y + 5);
                    ctx.stroke();
                }
            }
        });
        
        // Connect points with lines
        if (points.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
        }
    }
    
    // Draw all data
    drawPoints(audiogramData.right.ac, '#ff0000', 'circle'); // Red circles
    drawPoints(audiogramData.left.ac, '#0000ff', 'cross');   // Blue crosses
    drawPoints(audiogramData.right.bc, '#ff0000', '<');      // Red <
    drawPoints(audiogramData.left.bc, '#0000ff', '>');       // Blue >
    
    // Legend
    ctx.fillStyle = '#333';
    ctx.font = '11px Segoe UI';
    ctx.textAlign = 'left';
    
    const legendX = padding + 10;
    const legendY = padding + 10;
    
    ctx.fillStyle = '#ff0000';
    ctx.fillText('Right Ear: AC (○), BC (<)', legendX, legendY);
    ctx.fillStyle = '#0000ff';
    ctx.fillText('Left Ear: AC (✕), BC (>)', legendX, legendY + 15);
}

// Add event listeners to all audiogram inputs
document.querySelectorAll('.ac-right, .bc-right, .ac-left, .bc-left').forEach(input => {
    input.addEventListener('input', collectAudiogramData);
});
document.getElementById('hearingLossTypeRight').addEventListener('change', collectAudiogramData);
document.getElementById('hearingLossTypeLeft').addEventListener('change', collectAudiogramData);

// ===== HEARING AID TRIALS =====
let trialCount = 0;
const trialsContainer = document.getElementById('trials-container');
const previewTrials = document.getElementById('preview-trials');

function addTrialEntry(id, data = {}) {
    const trialId = id || ++trialCount;
    
    const trialDiv = document.createElement('div');
    trialDiv.className = 'trial-entry';
    trialDiv.dataset.trialId = trialId;
    
    trialDiv.innerHTML = `
        <button type="button" class="btn-remove" onclick="removeTrial(${trialId})">Remove</button>
        <h4>Trial ${trialId}</h4>
        <div class="form-group">
            <label>Model</label>
            <input type="text" class="trial-model" placeholder="Model name" value="${data.model || ''}">
        </div>
        <div class="form-group">
            <label>Type</label>
            <select class="trial-type" data-trial="${trialCount}">
                <option value="BTE">BTE</option>
                <option value="RIC">RIC</option>
                <option value="CIC">CIC</option>
                <option value="ITC">ITC</option>
                <option value="ITE">ITE</option>
            </select>
        </div>
        <div class="form-group">
            <label>Fitting</label>
            <select class="trial-fitting">
                <option value="Monoaural">Monoaural</option>
                <option value="Binaural">Binaural</option>
            </select>
        </div>
        <div class="form-group">
            <label>SDS</label>
            <input type="text" class="trial-sds" placeholder="SDS" value="${data.sds || ''}">
        </div>
        <div class="form-group">
            <label>Satisfaction (1-10)</label>
            <input type="number" min="1" max="10" class="trial-satisfaction" placeholder="Score" value="${data.satisfaction || ''}">
        </div>
        <div class="form-group">
            <label>Supplier Name</label>
            <input type="text" class="trial-supplier" placeholder="Supplier" value="${data.supplier || ''}">
        </div>
    `;
    
    trialsContainer.appendChild(trialDiv);
    
    // Add event listeners
    trialDiv.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', updateTrialsPreview);
        input.addEventListener('change', updateTrialsPreview);
        input.addEventListener('input', saveFormState); // Save on change
    });
    
    // Set select values from data
    trialDiv.querySelector('.trial-type').value = data.type || 'BTE';
    trialDiv.querySelector('.trial-fitting').value = data.fitting || 'Monoaural';

    updateTrialsPreview();
    return trialDiv;
}

function removeTrial(id) {
    const trialDiv = document.querySelector(`[data-trial-id="${id}"]`);
    if (trialDiv) {
        trialDiv.remove();
        updateTrialsPreview();
        saveFormState(); // Save after removal
    }
}

function updateTrialsPreview() {
    previewTrials.innerHTML = '';
    
    const trialDataArray = [];
    const trials = document.querySelectorAll('.trial-entry');

    // 1. Collect all trial data into an array
    trials.forEach(trial => {
        trialDataArray.push({
            model: trial.querySelector('.trial-model').value || '',
            type: trial.querySelector('.trial-type').value || '',
            fitting: trial.querySelector('.trial-fitting').value || '',
            sds: trial.querySelector('.trial-sds').value || '',
            satisfaction: trial.querySelector('.trial-satisfaction').value || '0',
            supplier: trial.querySelector('.trial-supplier').value || ''
        });
    });

    // 2. Sort the array by satisfaction score in descending order
    trialDataArray.sort((a, b) => (parseInt(b.satisfaction) || 0) - (parseInt(a.satisfaction) || 0));

    // 3. Populate the preview table with the sorted data
    trialDataArray.forEach((data, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.model}</td>
            <td>${data.type}</td>
            <td>${data.fitting}</td>
            <td>${data.sds}</td>
            <td>${data.satisfaction === '0' ? '' : data.satisfaction}</td>
            <td>${data.supplier}</td>
        `;
        previewTrials.appendChild(row);
    });
    
    // Auto-select best model based on highest satisfaction
    selectBestModel();
}

function selectBestModel() {
    const trials = document.querySelectorAll('.trial-entry');
    let maxSatisfaction = 0;
    let bestModel = '';
    let bestSupplier = '';
    
    trials.forEach(trial => {
        const satisfaction = parseInt(trial.querySelector('.trial-satisfaction').value) || 0;
        const model = trial.querySelector('.trial-model').value || '';
        const supplier = trial.querySelector('.trial-supplier').value || '';
        
        if (satisfaction > maxSatisfaction) {
            maxSatisfaction = satisfaction;
            bestModel = model;
            bestSupplier = supplier;
        }
    });
    
    document.getElementById('selectedModel').value = bestModel;
    document.getElementById('selectedSupplier').value = bestSupplier;
    document.getElementById('preview-selectedModel').textContent = bestModel;
    document.getElementById('preview-selectedSupplier').textContent = bestSupplier;
}

document.getElementById('addTrial').addEventListener('click', () => {
    addTrialEntry();
});

// Auto-set fitting based on ear affected
document.getElementById('earAffected').addEventListener('change', function() {
    const earAffected = this.value;
    const fittingSelects = document.querySelectorAll('.trial-fitting');
    
    if (earAffected === 'Bilateral') {
        fittingSelects.forEach(select => select.value = 'Binaural');
    } else {
        fittingSelects.forEach(select => select.value = 'Monoaural');
    }
    
    updateTrialsPreview();
});

// ===== NUMBER TO WORDS CONVERSION =====
const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertChunk(n) {
    let s = '';
    if (n >= 100) {
        s += units[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
    }
    if (n >= 10 && n <= 19) {
        s += teens[n - 10];
    } else if (n >= 20) {
        s += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
    }
    if (n >= 1 && n <= 9) {
        s += units[n];
    }
    return s.trim();
}

function numberToWords(num) {
    if (num === null || isNaN(num) || num === '') {
        return '';
    }
    num = Math.floor(Number(num)); // Ensure it's an integer

    if (num === 0) return 'Zero only';

    let words = '';
    let crore = Math.floor(num / 10000000); // 1 Crore = 10,000,000
    num %= 10000000;
    let lakh = Math.floor(num / 100000); // 1 Lakh = 100,000
    num %= 100000;
    let thousand = Math.floor(num / 1000);
    num %= 1000;

    if (crore > 0) {
        words += convertChunk(crore) + ' Crore ';
    }
    if (lakh > 0) {
        words += convertChunk(lakh) + ' Lakh ';
    }
    if (thousand > 0) {
        words += convertChunk(thousand) + ' Thousand ';
    }
    if (num > 0) {
        words += convertChunk(num);
    }

    return words.trim() + ' only';
}

function setupNumberToWords(numInputId, previewWordsId) {
    const numInput = document.getElementById(numInputId);
    const previewWords = document.getElementById(previewWordsId);

    if (numInput && previewWords) {
        const placeholderHTML = previewWords.innerHTML;
        const updateWords = () => {
            const words = numberToWords(numInput.value);
            if (numInput.value) {
                previewWords.textContent = words;
            } else {
                previewWords.innerHTML = placeholderHTML;
            }
            if (numInputId === 'warranty') updateConsentStatement(); // Update consent if warranty changes
        };
        numInput.addEventListener('input', updateWords);
    }
}

// ===== DISCOUNT PERCENTAGE CALCULATION =====
function updateDiscountPercentage() {
    const mrpInput = document.getElementById('mrp');
    const discountPriceInput = document.getElementById('discountPrice');
    const percentagePreview = document.getElementById('preview-discountPercentage');

    if (mrpInput && discountPriceInput && percentagePreview) {
        const mrp = parseFloat(mrpInput.value);
        const discountPrice = parseFloat(discountPriceInput.value);

        if (mrp > 0 && discountPrice >= 0 && mrp >= discountPrice) {
            const discount = mrp - discountPrice;
            const percentage = (discount / mrp) * 100;
            if (percentage > 0) {
                percentagePreview.textContent = `(${percentage.toFixed(2)}% off)`;
            } else {
                percentagePreview.textContent = '';
            }
        } else {
            percentagePreview.textContent = '';
        }
    }
}

// ===== PDF EXPORT =====
document.getElementById('exportPDF').addEventListener('click', function() {
    const element = document.getElementById('reportPreview');
    const rawCardNo = (document.getElementById('echsCardNo') && document.getElementById('echsCardNo').value) || '';
    const safeCardNo = rawCardNo.trim()
        .replace(/[\\\/:*?"<>|]/g, '') // remove invalid filename chars
        .replace(/\s+/g, '_') || 'Hearing_Aid_Report';
    const filename = `${safeCardNo}.pdf`;
    
    const opt = {
        margin: [5, 0, 15, 0],
        filename: filename,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 3,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };
    
    html2pdf().set(opt).from(element).save();
});

// ===== CLEAR FORM =====
document.getElementById('clearForm').addEventListener('click', function() {
    const confirmed = confirm("Are you sure you want to clear all form data? This will remove all saved information and cannot be undone.");
    if (confirmed) {
        // Remove the saved state from local storage
        localStorage.removeItem(formStateKey);
        // Reload the page to reset the form to its initial state
        location.reload();
    }
});

// ===== LOCAL STORAGE - SAVE & LOAD =====
const formStateKey = 'hearingReportFormData';

function saveFormState() {
    const state = {
        trials: []
    };

    // Save all standard inputs, selects, and textareas
    document.querySelectorAll('.input-panel input, .input-panel select, .input-panel textarea').forEach(el => {
        if (el.id) {
            if (el.type === 'checkbox') {
                state[el.id] = el.checked;
            } else {
                state[el.id] = el.value;
            }
            if (el.id === 'hearingLossTypeRight') state[el.id] = el.value;
            if (el.id === 'hearingLossTypeLeft') state[el.id] = el.value;
        }
    });

    // Save dynamic trial entries
    document.querySelectorAll('.trial-entry').forEach(trial => {
        state.trials.push({
            model: trial.querySelector('.trial-model').value,
            type: trial.querySelector('.trial-type').value,
            fitting: trial.querySelector('.trial-fitting').value,
            sds: trial.querySelector('.trial-sds').value,
            satisfaction: trial.querySelector('.trial-satisfaction').value,
            supplier: trial.querySelector('.trial-supplier').value,
        });
    });

    localStorage.setItem(formStateKey, JSON.stringify(state));
}

function loadFormState() {
    const savedState = localStorage.getItem(formStateKey);
    if (!savedState) {
        // If no saved state, run default initialization
        addTrialEntry();
        // Trigger all update functions to set initial placeholder texts from JS
        document.querySelectorAll('.input-panel input, .input-panel select').forEach(el => {
            if (el.type === 'select-one') {
                el.dispatchEvent(new Event('change'));
            } else {
                el.dispatchEvent(new Event('input'));
            }
        });
        updateTrialsPreview();
        return;
    }

    const state = JSON.parse(savedState);

    // Load standard inputs
    Object.keys(state).forEach(key => {
        if (key !== 'trials') {
            const el = document.getElementById(key);
            if (el) {
                if (el.type === 'checkbox') {
                    el.checked = state[key];
                } else {
                    el.value = state[key];
                }
                if (key === 'hearingLossTypeRight') el.value = state[key];
                if (key === 'hearingLossTypeLeft') el.value = state[key];
            }
        }
    });

    // Load dynamic trial entries
    trialsContainer.innerHTML = ''; // Clear default trial
    if (state.trials && state.trials.length > 0) {
        state.trials.forEach((trialData, index) => addTrialEntry(index + 1, trialData));
        trialCount = state.trials.length;
    } else {
        // If no trials were saved, add one default entry
        addTrialEntry();
    }

    // Trigger all update functions to refresh the preview
    // Dispatching events on each element is more reliable than calling update functions manually
    document.querySelectorAll('.input-panel input, .input-panel select').forEach(el => {
        if (el.type === 'select-one') {
            el.dispatchEvent(new Event('change'));
        } else {
            el.dispatchEvent(new Event('input'));
        }
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Load saved state from localStorage
    loadFormState();

    // Add event listeners to save form state on any input
    document.querySelector('.input-panel').addEventListener('input', saveFormState);
    document.querySelector('.input-panel').addEventListener('change', saveFormState);

    // Setup number-to-words conversion
    setupNumberToWords('mrp', 'preview-mrpWords', 'MRP in words');
    setupNumberToWords('discountPrice', 'preview-discountPriceWords', 'Price in words');
    setupNumberToWords('warranty', 'preview-warrantyWords', 'Yrs in words');

    // Setup discount percentage calculation
    document.getElementById('mrp').addEventListener('input', updateDiscountPercentage);
    document.getElementById('discountPrice').addEventListener('input', updateDiscountPercentage);

    // Initial calls are now handled by loadFormState
});
