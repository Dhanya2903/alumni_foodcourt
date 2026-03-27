const mongoose = require('mongoose');
const Food = require('./models/Food');
const User = require('./models/User');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing foods
        await Food.deleteMany({});
        console.log('Existing food items cleared.');

        const foods = [
            // --- PAROTTA ITEMS ---
            { name: 'Parotta', description: 'Soft and layered traditional parotta.', price: 12, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Chilly Parotta', description: 'Spiced and shredded parotta tossed with onions and chilies.', price: 45, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Ceylon Parotta', description: 'Stuffed and square-folded parotta.', price: 20, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Veechu Parotta', description: 'Thin and crispy parotta.', price: 20, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Egg Veechu', description: 'Veechu parotta with an egg layer.', price: 25, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Egg Parotta', description: 'Parotta prepared with scrambled eggs.', price: 20, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Veg. Kothu Parotta', description: 'Minced parotta with mixed vegetables and spices.', price: 40, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Egg Kothu Parotta', description: 'Minced parotta with eggs and spices.', price: 45, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Chi. Kothu Parotta', description: 'Minced parotta with chicken and spices.', price: 55, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },

            // --- ROAST ITEMS ---
            { name: 'Roast', description: 'Crispy plain dosa.', price: 25, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Ghee Roast', description: 'Dosa roasted with flavorful ghee.', price: 30, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Onion Roast', description: 'Dosa topped with fresh onions.', price: 30, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Masala Roast', description: 'Dosa with spiced potato filling.', price: 33, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Egg Roast', description: 'Dosa with a layer of egg.', price: 33, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Podi Roast', description: 'Dosa sprinkled with spicy lentil powder.', price: 30, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Dosai', description: 'Traditional South Indian crepe.', price: 15, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Egg Dosai', description: 'Dosa with an egg layer.', price: 22, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Podi Dosai', description: 'Dosa with spicy lentil powder.', price: 20, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Uthappam', description: 'Thick South Indian pancake.', price: 25, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Onion Uthappam', description: 'Thick pancake topped with onions.', price: 30, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Poori', description: 'Deep-fried puffed bread served with masala.', price: 12, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Chappathi', description: 'Flatbread made of whole wheat flour.', price: 12, category: 'Both', dietaryType: 'Veg', imageUrl: '' },

            // --- EGG SPECIALS ---
            { name: 'Omlet', description: 'Classic egg omelet.', price: 15, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Half Boil', description: 'Fried egg with a runny yolk.', price: 12, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Full Boil', description: 'Fried egg with fully cooked yolk.', price: 12, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Egg Poriyal', description: 'Scrambled eggs with spices.', price: 20, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Kalaki', description: 'Soft-cooked spicy scrambled egg.', price: 12, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Egg Masala', description: 'Hard-boiled eggs in a spicy gravy.', price: 30, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },

            // --- RICE & NOODLES ---
            { name: 'Veg Fried Rice', description: 'Stir-fried rice with mixed vegetables.', price: 40, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Sechzwan Veg Frd Rice', description: 'Spicy Schezwan rice with vegetables.', price: 45, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Gobi Fried Rice', description: 'Fried rice with crispy cauliflower.', price: 45, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Mushroom Fried Rice', description: 'Fried rice with fresh mushrooms.', price: 50, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Egg Fried Rice', description: 'Fried rice with scrambled eggs.', price: 45, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Sechzwan Egg Rice', description: 'Spicy Schezwan rice with eggs.', price: 50, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Chicken Fried Rice', description: 'Fried rice with chicken pieces.', price: 55, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Sechzwan Chi. Frd Rice', description: 'Spicy Schezwan rice with chicken.', price: 60, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Paneer Rice', description: 'Fried rice with cottage cheese cubes.', price: 60, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Veg Noodles', description: 'Stir-fried noodles with vegetables.', price: 45, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Sechzwan Veg. Noodles', description: 'Spicy Schezwan noodles with vegetables.', price: 45, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Gobi Noodles', description: 'Noodles with crispy cauliflower.', price: 45, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Mushroom Noodles', description: 'Noodles with fresh mushrooms.', price: 50, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Egg Noodles', description: 'Noodles with scrambled eggs.', price: 45, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Sechzwan Egg Noodles', description: 'Spicy Schezwan noodles with eggs.', price: 50, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Chicken Noodles', description: 'Noodles with chicken pieces.', price: 55, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Sechzwan Chi. Noodles', description: 'Spicy Schezwan noodles with chicken.', price: 60, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Paneer Noodles', description: 'Noodles with cottage cheese cubes.', price: 60, category: 'Both', dietaryType: 'Veg', imageUrl: '' },

            // --- CHICKEN DRY ---
            { name: 'Chicken 65', description: 'Deep-fried spicy chicken bites.', price: 65, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Chicken Pallipalayam', description: 'Traditional spicy chicken dish.', price: 70, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Chicken Maharani', description: 'Rich and royal chicken preparation.', price: 70, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Chicken Pepper', description: 'Chicken tossed with crushed black pepper.', price: 70, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Chicken Hyderabad', description: 'Hyderabadi style dry chicken.', price: 75, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Chicken Lemon', description: 'Tangy and spicy lemon chicken.', price: 75, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Chicken Manjurian', description: 'Chicken in a tangy Manchurian sauce.', price: 75, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Chicken Sechzwan', description: 'Spicy Schezwan style dry chicken.', price: 75, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },

            // --- CHICKEN GRAVY ---
            { name: 'Chicken Masala', description: 'Classic chicken in a spiced gravy.', price: 70, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Chicken Chettinadu', description: 'Spicy South Indian style chicken gravy.', price: 70, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Chicken Pallipalayam Gravy', description: 'Chicken Pallipalayam in a rich gravy.', price: 70, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },
            { name: 'Chicken Pepper Gravy', description: 'Spicy chicken gravy with black pepper.', price: 70, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },

            // --- VEG SPECIALS ---
            { name: 'Gobi Chilly', description: 'Crispy cauliflower with chilies.', price: 40, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Gobi Masala', description: 'Cauliflower in a spiced gravy.', price: 45, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Gobi Manjurian', description: 'Cauliflower in a tangy Manchurian sauce.', price: 50, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Gobi Pallipalyam', description: 'Traditional spicy cauliflower preparation.', price: 50, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Musroom Chilly', description: 'Crispy mushrooms with chilies.', price: 50, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Mushroom Masala', description: 'Mushrooms in a thick spiced gravy.', price: 55, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Mushroom Manjurian', description: 'Mushrooms in a tangy Manchurian sauce.', price: 60, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Mushroom Pallipalayam', description: 'Traditional spicy mushroom preparation.', price: 60, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Paneer Manjurian', description: 'Cottage cheese in a tangy Manchurian sauce.', price: 70, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Paneer Butter Masala', description: 'Creamy cottage cheese in buttery tomato gravy.', price: 75, category: 'Both', dietaryType: 'Veg', imageUrl: '' },

            // --- BREADS ---
            { name: 'Naan', description: 'Soft and leavened oven-baked bread.', price: 20, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Butter Naan', description: 'Soft naan topped with melted butter.', price: 25, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Romali Rotti', description: 'Paper-thin and soft flatbread.', price: 20, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Romali Butter Rotti', description: 'Paper-thin bread topped with butter.', price: 25, category: 'Both', dietaryType: 'Veg', imageUrl: '' },

            // --- SPECIALS ---
            { name: 'Variety Rice', description: 'Daily special flavored rice.', price: 40, category: 'Both', dietaryType: 'Veg', imageUrl: '' },
            { name: 'Chicken Briyani', description: 'Fragrant rice cooked with tender chicken and spices.', price: 60, category: 'Both', dietaryType: 'Non-Veg', imageUrl: '' },

            // --- CAKES (DESSERT) ---
            { name: 'Black Forest Cake (1/2 kg)', description: 'Classic layers of chocolate sponge and cherries.', price: 350, category: 'Both', dietaryType: 'Dessert', imageUrl: '' },
            { name: 'Black Forest Cake (1 kg)', description: 'Large layers of chocolate sponge and cherries.', price: 500, category: 'Both', dietaryType: 'Dessert', imageUrl: '' },
            { name: 'White Forest Cake (1/2 kg)', description: 'Vanilla sponge with white chocolate flakes.', price: 350, category: 'Both', dietaryType: 'Dessert', imageUrl: '' },
            { name: 'White Forest Cake (1 kg)', description: 'Large vanilla sponge with white chocolate flakes.', price: 500, category: 'Both', dietaryType: 'Dessert', imageUrl: '' },
            { name: 'Vanilla Cake (1/2 kg)', description: 'Classic vanilla sponge with creamy frosting.', price: 350, category: 'Both', dietaryType: 'Dessert', imageUrl: '' },
            { name: 'Vanilla Cake (1 kg)', description: 'Large vanilla sponge with creamy frosting.', price: 500, category: 'Both', dietaryType: 'Dessert', imageUrl: '' },
            { name: 'Chocolate Cake (1/2 kg)', description: 'Dark chocolate sponge with rich ganache.', price: 350, category: 'Both', dietaryType: 'Dessert', imageUrl: '' },
            { name: 'Chocolate Cake (1 kg)', description: 'Large chocolate sponge with rich ganache.', price: 500, category: 'Both', dietaryType: 'Dessert', imageUrl: '' },
            { name: 'Pineapple Cake (1/2 kg)', description: 'Tropical pineapple flavored sponge cake.', price: 350, category: 'Both', dietaryType: 'Dessert', imageUrl: '' },
            { name: 'Pineapple Cake (1 kg)', description: 'Large tropical pineapple flavored sponge cake.', price: 500, category: 'Both', dietaryType: 'Dessert', imageUrl: '' }
        ];

        await Food.insertMany(foods);
        console.log('Food items updated with full price list (No Images) successfully!');

        // Check if Admin exists, if not create one
        const adminEmail = 'admin@campuseats.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (!existingAdmin) {
            const adminUser = new User({
                name: 'System Admin',
                email: adminEmail,
                password: 'adminpassword123',
                userType: 'Admin'
            });
            await adminUser.save();
            console.log('Default Admin account created:');
        }

        mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
