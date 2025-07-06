const fs = require('fs');
const path = require('path');

// Read the production schema file
const schemaText = fs.readFileSync(path.join(__dirname, '../production-schema-complete.txt'), 'utf8');

// Parse the schema text and convert to SQL
function convertSchemaToSQL(schemaText) {
  const lines = schemaText.split('\n');
  const tables = [];
  let currentTable = null;
  let inTable = false;
  
  for (const line of lines) {
    // Detect table start
    if (line.match(/^Table "public\.(\w+)"/)) {
      const tableName = line.match(/^Table "public\.(\w+)"/)[1];
      currentTable = {
        name: tableName,
        columns: [],
        constraints: [],
        indexes: [],
        foreignKeys: []
      };
      inTable = true;
      tables.push(currentTable);
    }
    // Parse columns
    else if (inTable && line.match(/^\s+(\w+)\s+\|/)) {
      const parts = line.split('|').map(p => p.trim());
      if (parts[0] && parts[1] && parts[0] !== 'Column') {
        const column = {
          name: parts[0],
          type: parts[1],
          nullable: parts[2] === 'not null' ? false : true,
          default: parts[3] || null
        };
        currentTable.columns.push(column);
      }
    }
    // Parse indexes
    else if (line.includes('Indexes:')) {
      // Skip - we'll handle indexes separately
    }
    // Parse foreign keys
    else if (line.includes('FOREIGN KEY')) {
      const fkMatch = line.match(/FOREIGN KEY \(([^)]+)\) REFERENCES (\w+)\(([^)]+)\)/);
      if (fkMatch) {
        currentTable.foreignKeys.push({
          columns: fkMatch[1],
          refTable: fkMatch[2],
          refColumns: fkMatch[3]
        });
      }
    }
  }
  
  return tables;
}

// Generate SQL CREATE statements
function generateSQL(tables) {
  let sql = `-- Production Schema Sync
-- Generated from production-schema-complete.txt
-- Total tables: ${tables.length}

`;

  // First, create all tables without foreign keys
  for (const table of tables) {
    sql += `-- Table: ${table.name}\n`;
    sql += `CREATE TABLE IF NOT EXISTS public.${table.name} (\n`;
    
    const columnDefs = table.columns.map(col => {
      let def = `    ${col.name} ${col.type}`;
      if (!col.nullable) def += ' NOT NULL';
      if (col.default && col.default !== 'null') {
        // Handle special defaults
        if (col.default.includes('uuid_generate_v4()')) {
          def += ' DEFAULT uuid_generate_v4()';
        } else if (col.default.includes('now()') || col.default.includes('CURRENT_TIMESTAMP')) {
          def += ' DEFAULT now()';
        } else if (col.default === 'true' || col.default === 'false') {
          def += ` DEFAULT ${col.default}`;
        } else if (!isNaN(col.default)) {
          def += ` DEFAULT ${col.default}`;
        } else {
          def += ` DEFAULT '${col.default}'`;
        }
      }
      return def;
    });
    
    // Add primary key if id column exists
    if (table.columns.some(col => col.name === 'id')) {
      columnDefs.push('    PRIMARY KEY (id)');
    }
    
    sql += columnDefs.join(',\n');
    sql += '\n);\n\n';
  }
  
  // Then add foreign keys
  sql += '-- Foreign Key Constraints\n';
  for (const table of tables) {
    for (const fk of table.foreignKeys) {
      sql += `ALTER TABLE public.${table.name} 
    ADD CONSTRAINT fk_${table.name}_${fk.refTable} 
    FOREIGN KEY (${fk.columns}) 
    REFERENCES public.${fk.refTable}(${fk.refColumns})
    ON DELETE CASCADE;\n`;
    }
  }
  
  return sql;
}

// Parse and convert
console.log('📄 Reading production schema...');
const tables = convertSchemaToSQL(schemaText);
console.log(`✅ Found ${tables.length} tables`);

// Generate SQL
console.log('🔧 Generating SQL...');
const sqlContent = generateSQL(tables);

// Write to file
const outputPath = path.join(__dirname, '../supabase/migrations/20250105_sync_local_to_production_full.sql');
fs.writeFileSync(outputPath, sqlContent);

console.log(`✅ SQL migration created: ${outputPath}`);
console.log('\nNext step: Run "supabase db push" to apply to local database');