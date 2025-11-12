import random
import datetime
import mysql.connector

# -----------------------------------------------
# 1️⃣ Database Connection Configuration
# -----------------------------------------------
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="sat123",
    database="expensetracker"
)
cursor = conn.cursor()

# -----------------------------------------------
# 2️⃣ Random Data (same as your JS version)
# -----------------------------------------------
random_data = [
    {"name": "Housing", "tags": ["rent", "mortgage", "utilities"]},
    {"name": "Transportation", "tags": ["car loan", "insurance", "gasoline", "public transit"]},
    {"name": "Food and Dining", "tags": ["groceries", "dining out", "takeout", "delivery"]},
    {"name": "Insurance", "tags": ["health", "life", "auto", "homeowners"]},
    {"name": "Entertainment", "tags": ["movies", "concerts", "hobbies", "gaming"]},
    {"name": "Clothing", "tags": ["apparel", "accessories", "shoes", "jewelry"]},
    {"name": "Gifts", "tags": ["birthdays", "anniversaries", "holidays", "weddings"]},
    {"name": "Health and Wellness", "tags": ["medical expenses", "fitness", "self-care", "medications"]},
    {"name": "Travel", "tags": ["flights", "hotels", "car rentals", "vacations"]},
    {"name": "Debt Repayment", "tags": ["credit cards", "loans", "student loans", "credit reports"]},
    {"name": "Savings", "tags": ["emergency fund", "retirement", "college funds", "savings goals"]},
    {"name": "Taxes", "tags": ["federal", "state", "local", "property taxes"]},
    {"name": "Utilities", "tags": ["electricity", "water", "gas", "internet", "cable"]},
    {"name": "Home Maintenance", "tags": ["repairs", "renovations", "upgrades", "home improvement"]},
    {"name": "Education", "tags": ["tuition", "fees", "books", "supplies"]},
    {"name": "Pets", "tags": ["veterinary care", "food", "toys", "supplies"]},
    {"name": "Subscriptions", "tags": ["streaming services", "software", "music", "magazines"]},
    {"name": "Personal Care", "tags": ["haircuts", "nail appointments", "skincare", "cosmetics"]},
    {"name": "Hobbies", "tags": ["gym memberships", "lessons", "equipment", "materials"]},
    {"name": "Miscellaneous", "tags": ["gift cards", "cashback rewards", "tips", "unclassified expenses"]}
]

# -----------------------------------------------
# 3️⃣ Helper Functions
# -----------------------------------------------
def get_or_create(table, name):
    """Get ID of existing record or insert and return new ID"""
    cursor.execute(f"SELECT id FROM {table} WHERE name = %s", (name,))
    result = cursor.fetchone()
    if result:
        return result[0]
    cursor.execute(f"INSERT INTO {table} (name, created_at, updated_at) VALUES (%s, %s, %s)", (name, datetime.date.today(), datetime.date.today()))
    conn.commit()
    return cursor.lastrowid


# -----------------------------------------------
# 4️⃣ Generate & Insert Random Expenses
# -----------------------------------------------
user_id = 2  # replace with your actual user ID
records_to_insert = 200

for _ in range(records_to_insert):
    expense_group = random.choice(random_data)
    categories = [random.choice(expense_group["tags"]) for _ in range(random.randint(1, 8))]

    # Get or create category and tag
    category_ids = [get_or_create("categories", cat) for cat in categories]

    # Random cost and date
    cost = round(random.uniform(50, 5000), 2)
    qty = round(random.randint(1, 100))
    days_ago = random.randint(0, 365)
    expense_date = datetime.date.today() - datetime.timedelta(days=days_ago)

    # Insert into expenses table
    cursor.execute("""
        INSERT INTO expenses (description, title, date, amount, expense, quantity, user_id, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, ("", expense_group["name"], expense_date, cost, cost * qty, qty, user_id, datetime.date.today(), datetime.date.today()) )
    conn.commit()

    expense_id = cursor.lastrowid

    # Link tag in expense_tags table (many-to-many)
    for cat_id in category_ids:
        cursor.execute("""
            INSERT INTO expense_category_relation (expenses_id, categories_id)
            VALUES (%s, %s)
        """, (expense_id, cat_id))
    conn.commit()

# -----------------------------------------------
# 5️⃣ Close Connection
# -----------------------------------------------
cursor.close()
conn.close()

print(f"✅ Successfully inserted {records_to_insert} random expense records.")
