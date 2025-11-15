const ExcelJS = require('exceljs');
const Poster = require('../models/Poster');
const Score = require('../models/Score');

exports.exportScores = async (req, res) => {
  try {
    const posters = await Poster.find().sort({ posterId: 1 });
    const scores = await Score.find()
      .populate('poster', 'posterId title')
      .populate('judge', 'username');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Poster Scores');

    worksheet.columns = [
      { header: 'Poster ID', key: 'posterId', width: 15 },
      { header: 'Poster Title', key: 'title', width: 30 },
      { header: 'Judge', key: 'judge', width: 20 },
      { header: 'Title (3)', key: 'title_marks', width: 12 },
      { header: 'Objectives (3)', key: 'objectives', width: 15 },
      { header: 'Methodology (8)', key: 'methodology', width: 17 },
      { header: 'Results (6)', key: 'results', width: 13 },
      { header: 'Presentation Q&A (5)', key: 'presentationQA', width: 20 },
      { header: 'Total (25)', key: 'total', width: 12 },
      { header: 'Comments', key: 'comments', width: 40 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    scores.forEach(score => {
      worksheet.addRow({
        posterId: score.poster?.posterId || 'N/A',
        title: score.poster?.title || 'N/A',
        judge: score.judge?.username || 'N/A',
        title_marks: score.marksForTitle,
        objectives: score.marksForObjectives,
        methodology: score.marksForMethodology,
        results: score.marksForResults,
        presentationQA: score.marksForPresentationQA,
        total: score.marksForOverall,
        comments: score.comments || ''
      });
    });

    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Poster ID', key: 'posterId', width: 15 },
      { header: 'Poster Title', key: 'title', width: 30 },
      { header: 'Judges Count', key: 'judgesCount', width: 15 },
      { header: 'Avg Title', key: 'avgTitle', width: 12 },
      { header: 'Avg Objectives', key: 'avgObjectives', width: 15 },
      { header: 'Avg Methodology', key: 'avgMethodology', width: 18 },
      { header: 'Avg Results', key: 'avgResults', width: 13 },
      { header: 'Avg Presentation Q&A', key: 'avgPresentationQA', width: 20 },
      { header: 'Average Total', key: 'avgTotal', width: 15 }
    ];

    summarySheet.getRow(1).font = { bold: true };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF70AD47' }
    };
    summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    for (const poster of posters) {
      const posterScores = await Score.find({ poster: poster._id });
      
      if (posterScores.length > 0) {
        const avgTitle = posterScores.reduce((sum, s) => sum + s.marksForTitle, 0) / posterScores.length;
        const avgObjectives = posterScores.reduce((sum, s) => sum + s.marksForObjectives, 0) / posterScores.length;
        const avgMethodology = posterScores.reduce((sum, s) => sum + s.marksForMethodology, 0) / posterScores.length;
        const avgResults = posterScores.reduce((sum, s) => sum + s.marksForResults, 0) / posterScores.length;
        const avgPresentationQA = posterScores.reduce((sum, s) => sum + s.marksForPresentationQA, 0) / posterScores.length;
        const avgTotal = posterScores.reduce((sum, s) => sum + s.marksForOverall, 0) / posterScores.length;

        summarySheet.addRow({
          posterId: poster.posterId,
          title: poster.title,
          judgesCount: posterScores.length,
          avgTitle: avgTitle.toFixed(2),
          avgObjectives: avgObjectives.toFixed(2),
          avgMethodology: avgMethodology.toFixed(2),
          avgResults: avgResults.toFixed(2),
          avgPresentationQA: avgPresentationQA.toFixed(2),
          avgTotal: avgTotal.toFixed(2)
        });
      }
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=TARIGYM_Poster_Scores.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
