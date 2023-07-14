class VectorDatabase {
  constructor() {
    this.data = [];
  }

  // Store a new entry in the vector database
  create(id, webText, vector) {
    const entry = { id, webText, vector };
    this.data.push(entry);
  }

  // Retrieve an entry from the vector database given an ID
  read(id) {
    return this.data.find(entry => entry.id === id) || null;
  }

  // Update an existing entry in the vector database
  update(id, webText, vector) {
    const entryIndex = this.data.findIndex(entry => entry.id === id);
    if (entryIndex !== -1) {
      this.data[entryIndex] = { id, webText, vector };
      return true;
    }
    return false;
  }

  // Delete an entry from the vector database given an ID
  delete(id) {
    const entryIndex = this.data.findIndex(entry => entry.id === id);
    if (entryIndex !== -1) {
      this.data.splice(entryIndex, 1);
      return true;
    }
    return false;
  }

  // Get all entries in the vector database
  getAll() {
    return this.data;
  }
}

// Example usage:
const db = new VectorDatabase();

// Create entries
db.create(1, 'Web Text 1', [1, 2, 3]);
db.create(2, 'Web Text 2', [4, 5, 6]);

// Read entries
console.log(db.read(1)); // Output: { id: 1, webText: 'Web Text 1', vector: [1, 2, 3] }
console.log(db.read(2)); // Output: { id: 2, webText: 'Web Text 2', vector: [4, 5, 6] }

// Update an entry
db.update(1, 'Updated Web Text 1', [7, 8, 9]);
console.log(db.read(1)); // Output: { id: 1, webText: 'Updated Web Text 1', vector: [7, 8, 9] }

// Delete an entry
db.delete(2);
console.log(db.getAll()); // Output: [{ id: 1, webText: 'Updated Web Text 1', vector: [7, 8, 9] }]

// Get all entries
console.log(db.getAll()); // Output: [{ id: 1, webText: 'Updated Web Text 1', vector: [7, 8, 9] }]