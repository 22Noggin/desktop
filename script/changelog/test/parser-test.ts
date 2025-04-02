import { findIssueRef, findReleaseNote } from '../parser'

describe('changelog/parser', () => {
  describe('findIssueRef', () => {
    it('detected fixes message at start of PR body', () => {
      const body = `
Fixes #2314

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin turpis
tempor euismod fermentum. Nullam hendrerit neque eget risus faucibus volutpat. Donec
ultrices, orci quis auctor ultrices, nulla lacus gravida lectus, non rutrum dolor
quam vel augue.`
      expect(findIssueRef(body)).toBe(' #2314')
    })

    it('detects multiple fixed issues in PR body', () => {
      const body = `
Fixes #2314
Fixes #1234

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin turpis
tempor euismod fermentum. Nullam hendrerit neque eget risus faucibus volutpat. Donec
ultrices, orci quis auctor ultrices, nulla lacus gravida lectus, non rutrum dolor
quam vel augue.`
      expect(findIssueRef(body)).toBe(' #2314 #1234')
    })

    it('handles colon after fixed message', () => {
      const body = `
Pellentesque pellentesque finibus fermentum. Aenean eget semper libero.

Fixes: #2314

Nam malesuada augue vel velit vehicula suscipit. Nunc posuere, velit at sodales
malesuada, quam tellus rutrum orci, et tincidunt sem nunc non velit. Cras
placerat, massa vel tristique iaculis, urna nisl tristique nibh, eget luctus
nisl quam in metus.`
      expect(findIssueRef(body)).toBe(' #2314')
    })

    it('handles closes syntax', () => {
      const body = `
Closes: #2314

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin turpis
tempor euismod fermentum. Nullam hendrerit neque eget risus faucibus volutpat. Donec
ultrices, orci quis auctor ultrices, nulla lacus gravida lectus, non rutrum dolor
quam vel augue.`
      expect(findIssueRef(body)).toBe(' #2314')
    })

    it('handles resolves syntax', () => {
      const body = `This resolves #2314 and is totally wild`
      expect(findIssueRef(body)).toBe(' #2314')
    })
  })

  describe('findReleaseNote', () => {
    it('detected release note at the end of the body', () => {
      const body = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin turpis
tempor euismod fermentum. Nullam hendrerit neque eget risus faucibus volutpat. Donec
ultrices, orci quis auctor ultrices, nulla lacus gravida lectus, non rutrum dolor
quam vel augue.

Notes: [Fixed] Fix lorem impsum dolor sit amet
`
      expect(findReleaseNote(body)).toBe(
        '[Fixed] Fix lorem impsum dolor sit amet'
      )
    })

    it('removes dot at the end of release note', () => {
      const body = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin turpis
tempor euismod fermentum. Nullam hendrerit neque eget risus faucibus volutpat. Donec
ultrices, orci quis auctor ultrices, nulla lacus gravida lectus, non rutrum dolor
quam vel augue.

Notes: [Fixed] Fix lorem impsum dolor sit amet.
`
      expect(findReleaseNote(body)).toBe(
        '[Fixed] Fix lorem impsum dolor sit amet'
      )
    })

    it('looks for the last Notes entry if there are several', () => {
      const body = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin turpis
tempor euismod fermentum. Nullam hendrerit neque eget risus faucibus volutpat. Donec
ultrices, orci quis auctor ultrices, nulla lacus gravida lectus, non rutrum dolor
quam vel augue.
Notes: ignore this notes

Notes: These are valid notes
`
      expect(findReleaseNote(body)).toBe('These are valid notes')
    })

    it('detected no release notes wanted for the PR', () => {
      const body = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin turpis
tempor euismod fermentum. Nullam hendrerit neque eget risus faucibus volutpat. Donec
ultrices, orci quis auctor ultrices, nulla lacus gravida lectus, non rutrum dolor
quam vel augue.

Notes: no-notes
`
      expect(findReleaseNote(body)).toBeNull()
    })

    it('detected no release notes were added to the PR', () => {
      const body = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin turpis
tempor euismod fermentum. Nullam hendrerit neque eget risus faucibus volutpat. Donec
ultrices, orci quis auctor ultrices, nulla lacus gravida lectus, non rutrum dolor
quam vel augue.`
      expect(findReleaseNote(body)).toBeUndefined()
    })
  })
})
const express = require('express');
const redis = require('redis');
const fetch = require('node-fetch');

const app = express();
const client = redis.createClient();

const cacheMiddleware = (req, res, next) => {
  const { key } = req.params;

  client.get(key, (err, data) => {
    if (err) throw err;

    if (data) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};

app.get('/api/:key', cacheMiddleware, async (req, res) => {
  const { key } = req.params;
  const response = await fetch(`https://api.example.com/data/${key}`);
  const data = await response.json();

  client.setex(key, 3600, JSON.stringify(data));
  res.send(data);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
{
  "name": "your-project-name",
  "version": "1.0.0",
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^27.0.0",
    "ts-jest": "^27.0.0",
    "typescript": "^4.0.0"
  }
}
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.datasets import load_iris

# Load dataset
data = load_iris()
X, y = data.data, data.target

# Split data into initial labeled and unlabeled sets
X_train, X_unlabeled, y_train, _ = train_test_split(X, y, test_size=0.95, random_state=42)
X_test, X_val, y_test, y_val = train_test_split(X_unlabeled, y, test_size=0.5, random_state=42)

# Initialize model
model = RandomForestClassifier()

# Active learning loop
n_iterations = 10
for i in range(n_iterations):
    # Train the model on the current labeled dataset
    model.fit(X_train, y_train)
    
    # Predict on the validation set
    y_pred = model.predict(X_val)
    accuracy = accuracy_score(y_val, y_pred)
    print(f"Iteration {i+1}, Accuracy: {accuracy:.2f}")
    
    # Select the most uncertain samples from the unlabeled set
    probs = model.predict_proba(X_unlabeled)
    uncertainties = np.max(probs, axis=1)
    uncertain_samples = np.argsort(uncertainties)[:10]  # Select top 10 most uncertain samples
    
    # Simulate querying the user for labels
    new_samples = X_unlabeled[uncertain_samples]
    new_labels = y[uncertain_samples]  # In practice, you would query the user for these labels
    
    # Add the new samples to the labeled dataset
    X_train = np.vstack((X_train, new_samples))
    y_train = np.hstack((y_train, new_labels))
    
    # Remove the newly labeled samples from the unlabeled set
    X_unlabeled = np.delete(X_unlabeled, uncertain_samples, axis=0)

# Final evaluation on the test set
y_test_pred = model.predict(X_test)
final_accuracy = accuracy_score(y_test, y_test_pred)
print(f"Final Accuracy: {final_accuracy:.2f}")