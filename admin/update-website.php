<?php
/**
 * Update Website Pages from Dashboard Data
 * يحدّث صفحات HTML من بيانات لوحة التحكم تلقائياً
 */

// Load data from JSON
$jsonData = file_get_contents(__DIR__ . '/full-data.json');
$data = json_decode($jsonData, true);

if (!$data) {
    die("Error: Could not load data from full-data.json");
}

// Update Materials Page
updateMaterialsPage($data['materials']);

// Update Feed Page  
updateFeedPage($data['feedCompanies']);

// Update Eggs Page
updateEggsPage($data['eggs']);

// Update Poultry Page
updatePoultryPage($data['poultry']);

echo "✅ All pages updated successfully!\n";

// ============ FUNCTIONS ============

function updateMaterialsPage($materials) {
    $htmlFile = '../materials.html';
    $html = file_get_contents($htmlFile);
    
    // Build new materials table rows
    $rows = '';
    foreach ($materials as $item) {
        $rows .= <<<HTML
                        <tr>
                            <td class="item-cell">
                                <span class="item-icon">{$item['icon']}</span>
                                <span class="item-name">{$item['name']}</span>
                            </td>
                            <td class="price-cell">
                                <span class="price-badge orange">{$item['price']}</span>
                            </td>
                            <td class="price-cell">
                                <span style="color: #6b7280; font-size: 14px;">04/12</span>
                            </td>
                        </tr>

HTML;
    }
    
    // Replace table content
    $pattern = '/(<tbody>)(.*?)(<\/tbody>)/s';
    $replacement = '$1' . "\n" . $rows . '                    $3';
    $html = preg_replace($pattern, $replacement, $html);
    
    file_put_contents($htmlFile, $html);
    echo "✅ Materials page updated\n";
}

function updateFeedPage($feedCompanies) {
    $htmlFile = '../feed.html';
    $html = file_get_contents($htmlFile);
    
    // Build new feed companies cards
    $cards = '';
    foreach ($feedCompanies as $company) {
        $logoHtml = $company['logo'] ? 
            '<img src="' . $company['logo'] . '" alt="' . $company['name'] . '" style="width: 40px; height: 40px; border-radius: 8px; object-fit: contain;">' : 
            '';
        
        $cards .= <<<HTML
                <!-- {$company['name']} -->
                <div style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #e5e7eb;">
                    <h3 style="color: #374151; font-size: 18px; margin-bottom: 12px; font-weight: 600; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                        {$logoHtml}
                        {$company['name']}
                    </h3>
                    <div style="display: flex; gap: 8px; justify-content: space-between;">
                        <div style="text-align: center; padding: 10px; flex: 1;">
                            <div style="color: #1f2937; font-weight: 600; font-size: 15px; margin-bottom: 8px;">بادي 23%</div>
                            <div style="color: #111827; font-weight: 700; font-size: 17px;">{$company['bady23']}</div>
                        </div>
                        <div style="width: 2px; background: #e5e7eb;"></div>
                        <div style="text-align: center; padding: 10px; flex: 1;">
                            <div style="color: #1f2937; font-weight: 600; font-size: 15px; margin-bottom: 8px;">نامي 21%</div>
                            <div style="color: #111827; font-weight: 700; font-size: 17px;">{$company['namy21']}</div>
                        </div>
                        <div style="width: 2px; background: #e5e7eb;"></div>
                        <div style="text-align: center; padding: 10px; flex: 1;">
                            <div style="color: #1f2937; font-weight: 600; font-size: 15px; margin-bottom: 8px;">ناهي 19%</div>
                            <div style="color: #111827; font-weight: 700; font-size: 17px;">{$company['nahy19']}</div>
                        </div>
                    </div>
                </div>


HTML;
    }
    
    // Replace feed companies section
    $pattern = '/(grid-template-columns: repeat\(auto-fit, minmax\(280px, 1fr\)\);[^>]*>)(.*?)(<\/div>\s*<\/section>)/s';
    $replacement = '$1' . "\n" . $cards . '            $3';
    $html = preg_replace($pattern, $replacement, $html);
    
    file_put_contents($htmlFile, $html);
    echo "✅ Feed page updated\n";
}

function updateEggsPage($eggs) {
    $htmlFile = '../eggs.html';
    $html = file_get_contents($htmlFile);
    
    // Build new eggs table rows
    $rows = '';
    foreach ($eggs as $item) {
        $rows .= <<<HTML
                        <tr>
                            <td class="item-cell">
                                <span class="item-icon">🥚</span>
                                <span class="item-name">{$item['name']}</span>
                            </td>
                            <td class="price-cell">
                                <span class="price-badge teal">{$item['price']}</span>
                            </td>
                        </tr>

HTML;
    }
    
    // Replace table content
    $pattern = '/(<tbody>)(.*?)(<\/tbody>)/s';
    $replacement = '$1' . "\n" . $rows . '                    $3';
    $html = preg_replace($pattern, $replacement, $html);
    
    file_put_contents($htmlFile, $html);
    echo "✅ Eggs page updated\n";
}

function updatePoultryPage($poultry) {
    $htmlFile = '../poultry.html';
    $html = file_get_contents($htmlFile);
    
    // Build new poultry table rows
    $rows = '';
    foreach ($poultry as $item) {
        $rows .= <<<HTML
                        <tr>
                            <td class="item-cell">
                                <span class="item-icon">{$item['icon']}</span>
                                <span class="item-name">{$item['name']}</span>
                            </td>
                            <td class="price-cell">
                                <span class="price-badge blue">{$item['priceAnnounced']}</span>
                            </td>
                            <td class="price-cell">
                                <span class="price-badge green">{$item['priceExecution']}</span>
                            </td>
                        </tr>

HTML;
    }
    
    // Replace table content
    $pattern = '/(<tbody>)(.*?)(<\/tbody>)/s';
    $replacement = '$1' . "\n" . $rows . '                    $3';
    $html = preg_replace($pattern, $replacement, $html);
    
    file_put_contents($htmlFile, $html);
    echo "✅ Poultry page updated\n";
}
?>
