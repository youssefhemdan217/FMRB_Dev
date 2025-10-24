import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

async function addUsers() {
  try {
    console.log('🔧 Adding users to database...');
    
    // Connect to the database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
      database: 'fmrb_db',
      port: 3306
    });

    // Hash passwords
    const adminPasswordHash = await bcrypt.hash('Admin1234', 10);
    const userPasswordHash = await bcrypt.hash('User1234', 10);

    // Insert admin user
    const adminUser = {
      email: 'Youssef@admin.com',
      password: adminPasswordHash,
      name: 'Youssef Admin',
      role: 'admin'
    };

    // Insert regular user
    const regularUser = {
      email: 'Youssef@user.com',
      password: userPasswordHash,
      name: 'Youssef User',
      role: 'user'
    };

    // Check if users already exist
    const [adminExists] = await connection.execute(
      'SELECT id FROM mb_users WHERE email = ?',
      [adminUser.email]
    );

    const [userExists] = await connection.execute(
      'SELECT id FROM mb_users WHERE email = ?',
      [regularUser.email]
    );

    // Insert admin user if doesn't exist
    if (Array.isArray(adminExists) && adminExists.length === 0) {
      await connection.execute(
        'INSERT INTO mb_users (email, password, name, role) VALUES (?, ?, ?, ?)',
        [adminUser.email, adminUser.password, adminUser.name, adminUser.role]
      );
      console.log('✅ Admin user added:', adminUser.email);
    } else {
      console.log('ℹ️ Admin user already exists:', adminUser.email);
    }

    // Insert regular user if doesn't exist
    if (Array.isArray(userExists) && userExists.length === 0) {
      await connection.execute(
        'INSERT INTO mb_users (email, password, name, role) VALUES (?, ?, ?, ?)',
        [regularUser.email, regularUser.password, regularUser.name, regularUser.role]
      );
      console.log('✅ Regular user added:', regularUser.email);
    } else {
      console.log('ℹ️ Regular user already exists:', regularUser.email);
    }

    // Verify users were added
    const [allUsers] = await connection.execute(
      'SELECT id, email, name, role, created_at FROM mb_users ORDER BY role DESC, created_at'
    );

    console.log('\n📋 All users in database:');
    console.table(allUsers);

    await connection.end();
    console.log('🎉 User setup complete!');
    
  } catch (error) {
    console.error('❌ Failed to add users:', error);
    process.exit(1);
  }
}

addUsers();