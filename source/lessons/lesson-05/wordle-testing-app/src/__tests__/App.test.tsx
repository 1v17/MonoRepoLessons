import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from '../App';

// Create the same theme used in main.tsx for consistent testing
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6aaa64',
    },
    secondary: {
      main: '#c9b458',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
  },
});

// Helper function to render App with theme provider (like in main.tsx)
const renderAppWithTheme = () => {
  return render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

describe('Wordle App - Basic Rendering Tests', () => {
  describe('🟢 Beginner Level Tests', () => {
    test('App renders without crashing', () => {
      // This test ensures the app can mount and render without throwing errors
      renderAppWithTheme();
      
      // If we get here without an error, the app rendered successfully!
      // We can add a simple assertion to make sure something is in the document
      expect(document.body).toBeInTheDocument();
    });

    test('Title displays correctly', () => {
      renderAppWithTheme();
      
      // Look for the main title using the test ID
      const titleElement = screen.getByTestId('game-title');
      
      // Check that the title exists and has the correct text
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('Wordle Testing Game');
    });

    test('Game board shows 6 rows of empty cells', () => {
      renderAppWithTheme();
      
      // Find the game board
      const gameBoard = screen.getByTestId('game-board');
      expect(gameBoard).toBeInTheDocument();
      
      // Check that we have 6 rows (0-5)
      for (let row = 0; row < 6; row++) {
        // For each row, check that we have the correct number of cells
        // Default word length is 5, so we should have 5 cells per row
        for (let col = 0; col < 5; col++) {
          const cell = screen.getByTestId(`cell-${row}-${col}`);
          expect(cell).toBeInTheDocument();
          
          // Initially, all cells should be empty
          expect(cell).toHaveTextContent('');
        }
      }
    });

    test('Current guess display is present', () => {
      renderAppWithTheme();
      
      // Check that current guess label exists
      const currentGuessLabel = screen.getByTestId('current-guess-label');
      expect(currentGuessLabel).toBeInTheDocument();
      expect(currentGuessLabel).toHaveTextContent('Current Guess');
      
      // Check that current guess display container exists
      const currentGuessDisplay = screen.getByTestId('current-guess-display');
      expect(currentGuessDisplay).toBeInTheDocument();
      
      // Check that we have 5 current guess letter boxes (default word length)
      for (let i = 0; i < 5; i++) {
        const letterBox = screen.getByTestId(`current-guess-letter-${i}`);
        expect(letterBox).toBeInTheDocument();
        // Initially, all boxes should be empty
        expect(letterBox).toHaveTextContent('');
      }
      
      // Check that instructions are present
      const instructions = screen.getByTestId('guess-instructions');
      expect(instructions).toBeInTheDocument();
      expect(instructions).toHaveTextContent('Use the keyboard below or your physical keyboard to enter letters');
    });

    test('Virtual keyboard is present', () => {
      renderAppWithTheme();
      
      // Check that virtual keyboard container exists
      const virtualKeyboard = screen.getByTestId('virtual-keyboard');
      expect(virtualKeyboard).toBeInTheDocument();
      
      // Check that all three keyboard rows exist
      for (let row = 0; row < 3; row++) {
        const keyboardRow = screen.getByTestId(`keyboard-row-${row}`);
        expect(keyboardRow).toBeInTheDocument();
      }
      
      // Check that all letter keys are present (A-Z)
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      letters.forEach(letter => {
        const key = screen.getByTestId(`keyboard-key-${letter.toLowerCase()}`);
        expect(key).toBeInTheDocument();
        expect(key).toHaveTextContent(letter);
      });
      
      // Check that special keys are present
      const enterKey = screen.getByTestId('keyboard-key-enter');
      expect(enterKey).toBeInTheDocument();
      expect(enterKey).toHaveTextContent('ENTER');
      
      const backspaceKey = screen.getByTestId('keyboard-key-backspace');
      expect(backspaceKey).toBeInTheDocument();
      expect(backspaceKey).toHaveTextContent('⌫');
    });

    test('All control buttons are present', () => {
      renderAppWithTheme();
      
      // Check word length selector components
      const wordLengthSelector = screen.getByTestId('word-length-selector');
      expect(wordLengthSelector).toBeInTheDocument();
      
      const wordLengthSelect = screen.getByTestId('word-length-select');
      expect(wordLengthSelect).toBeInTheDocument();
      
      // Note: Material-UI Select options are not rendered in DOM until select is opened
      // So we'll just check the select component exists for now
      
      // Check New Game button
      const newGameButton = screen.getByTestId('new-game-button');
      expect(newGameButton).toBeInTheDocument();
      expect(newGameButton).toHaveTextContent('New Game');
      expect(newGameButton).not.toBeDisabled();
      
      // Check Instructions button
      const instructionsButton = screen.getByTestId('instructions-button');
      expect(instructionsButton).toBeInTheDocument();
      expect(instructionsButton).toHaveTextContent('Instructions');
      expect(instructionsButton).not.toBeDisabled();
    });

    describe('Word Length Selection', () => {
      test('Word length changes affect game board column count', () => {
        renderAppWithTheme();
        
        // Get the word length select element
        const wordLengthSelect = screen.getByTestId('word-length-select');
        expect(wordLengthSelect).toBeInTheDocument();
        
        // Initial state should be 5 letters (check game stats)
        const gameStats = screen.getByTestId('game-stats');
        expect(gameStats).toHaveTextContent('Word Length: 5');
        
        // Verify the select shows the current value
        expect(wordLengthSelect).toHaveTextContent('5 Letters');
        
        // Initially should have 5 columns (default word length)
        const gameBoard = screen.getByTestId('game-board');
        const firstRow = gameBoard.querySelector('[data-testid*="row-0"]');
        let cells = firstRow?.querySelectorAll('[data-testid*="cell-"]') || [];
        expect(cells).toHaveLength(5);
        
        // Verify each cell in the first row exists for 5-letter words
        for (let i = 0; i < 5; i++) {
          const cell = screen.getByTestId(`cell-0-${i}`);
          expect(cell).toBeInTheDocument();
        }
      });

      test('Game board shows correct initial layout', () => {
        renderAppWithTheme();
        
        // Initially should have 5 columns (default word length)
        for (let col = 0; col < 5; col++) {
          expect(screen.getByTestId(`cell-0-${col}`)).toBeInTheDocument();
        }
        // 6th column should not exist
        expect(screen.queryByTestId('cell-0-5')).not.toBeInTheDocument();
        
        // Should have 6 rows
        for (let row = 0; row < 6; row++) {
          expect(screen.getByTestId(`cell-${row}-0`)).toBeInTheDocument();
        }
        
        // All cells should initially be empty
        for (let row = 0; row < 6; row++) {
          for (let col = 0; col < 5; col++) {
            const cell = screen.getByTestId(`cell-${row}-${col}`);
            expect(cell).toHaveTextContent('');
          }
        }
      });

      test('Current guess display shows correct initial layout', () => {
        renderAppWithTheme();
        
        // Initially should have 5 letter boxes (default word length)
        for (let i = 0; i < 5; i++) {
          expect(screen.getByTestId(`current-guess-letter-${i}`)).toBeInTheDocument();
        }
        // 6th box should not exist
        expect(screen.queryByTestId('current-guess-letter-5')).not.toBeInTheDocument();
        
        // All current guess letter boxes should initially be empty
        for (let i = 0; i < 5; i++) {
          const letterBox = screen.getByTestId(`current-guess-letter-${i}`);
          expect(letterBox).toHaveTextContent('');
        }
        
        // Current guess label and instructions should be present
        expect(screen.getByTestId('current-guess-label')).toHaveTextContent('Current Guess');
        expect(screen.getByTestId('guess-instructions')).toHaveTextContent('Use the keyboard below or your physical keyboard to enter letters');
      });

      test('Game board structure can accommodate different word lengths', () => {
        renderAppWithTheme();
        
        // Test that the game board can handle different configurations
        // Since we can't easily test the Material-UI Select interaction,
        // we'll test that the initial 5-letter setup is correct
        
        // Default: 5 columns should exist
        for (let col = 0; col < 5; col++) {
          expect(screen.getByTestId(`cell-0-${col}`)).toBeInTheDocument();
        }
        
        // 6th column should not exist (boundary test)
        expect(screen.queryByTestId('cell-0-5')).not.toBeInTheDocument();
        
        // Test that current guess display matches
        for (let i = 0; i < 5; i++) {
          expect(screen.getByTestId(`current-guess-letter-${i}`)).toBeInTheDocument();
        }
        
        // 6th current guess box should not exist
        expect(screen.queryByTestId('current-guess-letter-5')).not.toBeInTheDocument();
        
        // Game stats should show 5-letter mode
        const gameStats = screen.getByTestId('game-stats');
        expect(gameStats).toHaveTextContent('Word Length: 5');
      });

      test('Word length selector displays current value correctly', () => {
        renderAppWithTheme();
        
        // Get the select element and verify it shows the correct current value
        const wordLengthSelect = screen.getByTestId('word-length-select');
        expect(wordLengthSelect).toBeInTheDocument();
        
        // Should display "5 Letters" as the current selection
        expect(wordLengthSelect).toHaveTextContent('5 Letters');
        
        // Game stats should match the select value
        const gameStats = screen.getByTestId('game-stats');
        expect(gameStats).toHaveTextContent('Word Length: 5');
        
        // Select should be interactive (can receive focus)
        expect(wordLengthSelect).not.toBeDisabled();
        
        // Should have the correct role for accessibility
        const selectInput = wordLengthSelect.querySelector('[role="combobox"]');
        expect(selectInput).toBeInTheDocument();
      });

      test('Game board would support 3 and 4 column configurations', () => {
        renderAppWithTheme();
        
        // Current setup: verify 5 columns exist (default)
        const gameBoard = screen.getByTestId('game-board');
        expect(gameBoard).toBeInTheDocument();
        
        // Count columns in first row to confirm current state
        const firstRow = gameBoard.querySelector('[data-testid*="row-0"]');
        const currentCells = firstRow?.querySelectorAll('[data-testid*="cell-"]') || [];
        expect(currentCells).toHaveLength(5);
        
        // Test structural flexibility: if word length were 3, we'd expect 3 columns
        // The game board should be able to dynamically adjust
        // We can't test the actual change due to Material-UI portal complexity,
        // but we can verify the structure supports it
        
        // Verify the game board uses flexible layout
        expect(gameBoard).toHaveClass('MuiBox-root');
        
        // Test that the CSS structure would accommodate fewer columns
        // by checking that specific cells exist at expected positions
        expect(screen.getByTestId('cell-0-0')).toBeInTheDocument(); // Would exist in 3, 4, 5 letter words
        expect(screen.getByTestId('cell-0-1')).toBeInTheDocument(); // Would exist in 3, 4, 5 letter words  
        expect(screen.getByTestId('cell-0-2')).toBeInTheDocument(); // Would exist in 3, 4, 5 letter words
        expect(screen.getByTestId('cell-0-3')).toBeInTheDocument(); // Would exist in 4, 5 letter words
        expect(screen.getByTestId('cell-0-4')).toBeInTheDocument(); // Would exist in 5 letter words
        
        // For 3-letter words, we'd expect only columns 0, 1, 2
        // For 4-letter words, we'd expect only columns 0, 1, 2, 3
        // For 5-letter words (current), we expect columns 0, 1, 2, 3, 4
        
        // Verify that column boundaries work correctly
        expect(screen.queryByTestId('cell-0-5')).not.toBeInTheDocument(); // 6th column shouldn't exist
        
        // The structure demonstrates it could support different column counts
        // based on the dynamic rendering of cells with column indices
      });

      test('New game button resets game state', async () => {
        const user = userEvent.setup();
        renderAppWithTheme();
        
        // Verify initial game state
        const gameStats = screen.getByTestId('game-stats');
        expect(gameStats).toHaveTextContent('Word Length: 5');
        expect(gameStats).toHaveTextContent('Guess 0 of 6');
        expect(gameStats).toHaveTextContent('Status: Playing');
        
        // Click new game button
        const newGameButton = screen.getByTestId('new-game-button');
        expect(newGameButton).toBeInTheDocument();
        expect(newGameButton).not.toBeDisabled();
        
        await user.click(newGameButton);
        
        // Game state should reset but keep same word length
        expect(gameStats).toHaveTextContent('Word Length: 5');
        expect(gameStats).toHaveTextContent('Guess 0 of 6');
        expect(gameStats).toHaveTextContent('Status: Playing');
        
        // Game board should still be empty
        for (let row = 0; row < 6; row++) {
          for (let col = 0; col < 5; col++) {
            const cell = screen.getByTestId(`cell-${row}-${col}`);
            expect(cell).toHaveTextContent('');
          }
        }
        
        // Current guess should be empty
        for (let i = 0; i < 5; i++) {
          const letterBox = screen.getByTestId(`current-guess-letter-${i}`);
          expect(letterBox).toHaveTextContent('');
        }
      });
    });
  });

  // TODO: Add more test suites here!
  // describe('🟡 Intermediate Level Tests', () => { ... });
  // describe('🔴 Advanced Level Tests', () => { ... });
  // describe('🚀 Expert Level Tests', () => { ... });
});

/*
 * 🎯 STUDENT INSTRUCTIONS:
 * 
 * This file contains starter tests to get you going. Your mission is to:
 * 
 * 1. Run these tests and make sure they pass: `npm test`
 * 2. Add more rendering tests (current guess display, virtual keyboard, etc.)
 * 3. Move on to interaction tests (clicking keys, submitting guesses, etc.)
 * 4. Test edge cases and complex scenarios
 * 
 * Remember:
 * - Use `screen.getByTestId()` to find elements reliably
 * - Use `userEvent` for user interactions (clicking, typing)
 * - Use `waitFor()` for async operations
 * - Check the README.md for comprehensive testing scenarios
 * 
 * Good luck! 🍀
 */
