import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Upload, FileText, LogOut, Loader2 } from 'lucide-react';
import { ReportOutput } from './ReportOutput';

export function SimplifierPage() {
  const { signOut, user } = useAuth();
  const [reportText, setReportText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setReportText('');
    }
  };

  const handleSimplify = async () => {
    if (!reportText.trim() && !file) {
      setError('Please upload a file or paste report text');
      return;
    }

    setError('');
    setLoading(true);
    setOutput(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockOutput = `### Abnormal Lab Values or Findings

1. **Hemoglobin**: 11.0 gms/dl (Normal range: M: 13.0 - 18.0 gms, F: 11.5 - 16.5 gms/dl)
   - **Explanation**: Hemoglobin is a protein in red blood cells that carries oxygen. A low level indicates anemia, which means your body may not be getting enough oxygen.
   - **Possible Conditions**: Anemia, nutritional deficiencies (like iron, vitamin B12, or folate), chronic disease.
   - **Severity**: Mild to moderate.
   - **Next Steps**: Further evaluation to determine the cause of anemia, including dietary assessment and possibly iron studies or vitamin levels.

2. **Absolute Eosinophil Count**: 460 cells/cumm (Normal range: 40-440 cells/cumm)
   - **Explanation**: Eosinophils are a type of white blood cell involved in allergic reactions and fighting parasites. An elevated count can indicate an allergic reaction or parasitic infection.
   - **Possible Conditions**: Allergies, asthma, parasitic infections, or certain autoimmune diseases.
   - **Severity**: Mild to moderate.
   - **Next Steps**: Allergy testing or stool tests for parasites may be recommended.

3. **S. Calcium**: 8.1 mg/dl (Normal range: 8.4 - 11.5 mg/dl)
   - **Explanation**: Calcium is essential for bone health and other bodily functions. A low level can affect bone density and muscle function.
   - **Possible Conditions**: Hypocalcemia, vitamin D deficiency, or parathyroid gland issues.
   - **Severity**: Mild.
   - **Next Steps**: Further tests to check vitamin D levels and parathyroid function, along with dietary assessment.

### Summary of Findings
- **Anemia** (mild to moderate)
- **Elevated Eosinophils** (mild to moderate)
- **Low Calcium** (mild)

### Disclaimer
This interpretation is for informational purposes only and should not be considered a diagnosis or a substitute for professional medical advice. Please consult a healthcare provider for a thorough evaluation and personalized recommendations.`;

      setOutput(mockOutput);
    } catch (err) {
      setError('Failed to process report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Medical Report Simplifier</h1>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Medical Report</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File (PDF or Image)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      <div className="text-center">
                        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700">
                          {file ? file.name : 'Click to upload file'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, PNG, JPG up to 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-sm text-gray-500 font-medium">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste Report Text
                  </label>
                  <textarea
                    value={reportText}
                    onChange={(e) => {
                      setReportText(e.target.value);
                      setFile(null);
                    }}
                    rows={12}
                    placeholder="Paste your medical report text here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSimplify}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing Report...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Simplify Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            {output ? (
              <ReportOutput output={output} />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No report processed yet</p>
                  <p className="text-sm mt-2">Upload or paste a medical report to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 text-center">
            <strong>Disclaimer:</strong> This is not a medical diagnosis. Please consult a qualified doctor.
          </p>
        </div>
      </main>
    </div>
  );
}
