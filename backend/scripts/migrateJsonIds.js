const fs = require('fs').promises;
const path = require('path');

const filesToMigrate = [
  'skills.json',
  'projects.json',
  'experience.json',
  'education.json',
  'certifications.json',
  'awards.json',
  'contacts.json'
];

async function migrateJsonIds() {
  console.log('Running JSON file ID migration check...');
  const dataDir = path.join(__dirname, '../data');
  
  for (const file of filesToMigrate) {
    const filePath = path.join(dataDir, file);
    try {
      let content;
      try {
        content = await fs.readFile(filePath, 'utf8');
      } catch (readErr) {
        // If file doesn't exist yet, we can skip it
        continue;
      }

      if (!content.trim()) continue;
      
      const items = JSON.parse(content);
      if (Array.isArray(items)) {
        let changed = false;
        
        // Find existing IDs to avoid duplicates if some items have IDs and some don't
        const existingIds = new Set(
          items
            .map(item => item.id)
            .filter(id => id !== undefined && id !== null)
            .map(id => Number(id))
        );

        let nextId = 1;
        while (existingIds.has(nextId)) {
          nextId++;
        }

        items.forEach((item) => {
          if (item.id === undefined || item.id === null) {
            item.id = nextId;
            existingIds.add(nextId);
            changed = true;
            
            // Find next available ID
            while (existingIds.has(nextId)) {
              nextId++;
            }
          }
        });

        if (changed) {
          await fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf8');
          console.log(`  [MIGRATED] Assigned missing IDs in ${file}`);
        }
      }
    } catch (err) {
      console.error(`  [ERROR] Failed to migrate IDs in ${file}:`, err.message);
    }
  }
  console.log('JSON file ID migration check completed.');
}

module.exports = migrateJsonIds;
