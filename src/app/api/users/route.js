import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { name, email, role, password, birthdate } = await req.json();

        // Validate required fields
        if (!name || !email || !role || !password || !birthdate) {
            return new Response(
                JSON.stringify({ error: 'All fields (name, email, role, password, birthdate) are required' }),
                { status: 400 }
            );
        }

        // Validate role
        const validRoles = ['swimmer', 'trainer', 'admin', 'father'];
        if (!validRoles.includes(role)) {
            return new Response(
                JSON.stringify({ error: `Invalid role. Valid roles are: ${validRoles.join(', ')}` }),
                { status: 400 }
            );
        }

        // Check if email is unique
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ error: 'Email is already in use' }),
                { status: 400 }
            );
        }

        // Create and save the user
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, role, password: hashedPassword, birthdate });
        await newUser.save();

        return new Response(JSON.stringify({ 
            message: 'User created successfully', 
            user: newUser.toJSON() // Use toJSON to include virtuals
        }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}


export async function GET() {
    try {
        await connectToDatabase();
        const users = await User.find({});
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}