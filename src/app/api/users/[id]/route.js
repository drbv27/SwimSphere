import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function GET(req, { params }) {
    try {
        await connectToDatabase();

        const { id } = params;
        const user = await User.findById(id);

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'User not found' }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(user.toJSON()), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}



export async function PUT(req) {
    try {
        await connectToDatabase();
        const id = req.url.split('/').pop();
        const updates = await req.json();

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedUser) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'User updated successfully', user: updatedUser }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectToDatabase();
        const id = req.url.split('/').pop();

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}