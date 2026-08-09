import unittest

from recommend import note_matches


class PreferredNoteMatchingTest(unittest.TestCase):
    def test_questionnaire_aliases_match_controlled_plural_variants(self):
        self.assertEqual(note_matches("Vanilla bean, musks", ["musk"]), ["musk"])
        self.assertEqual(note_matches("Bright citruses and woods", ["citrus"]), ["citrus"])

    def test_unrelated_substrings_do_not_match(self):
        self.assertEqual(note_matches("Muskmelon and rose", ["musk"]), [])


if __name__ == "__main__":
    unittest.main()
