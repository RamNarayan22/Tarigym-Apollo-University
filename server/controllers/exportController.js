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
      { header: 'Creativity', key: 'creativity', width: 12 },
      { header: 'Innovation', key: 'innovation', width: 12 },
      { header: 'Presentation', key: 'presentation', width: 15 },
      { header: 'Relevance', key: 'relevance', width: 12 },
      { header: 'Total', key: 'total', width: 10 },
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
        creativity: score.marksForCreativity,
        innovation: score.marksForInnovation,
        presentation: score.marksForPresentation,
        relevance: score.marksForRelevance,
        total: score.marksForOverall,
        comments: score.comments || ''
      });
    });

    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Poster ID', key: 'posterId', width: 15 },
      { header: 'Poster Title', key: 'title', width: 30 },
      { header: 'Judges Count', key: 'judgesCount', width: 15 },
      { header: 'Avg Creativity', key: 'avgCreativity', width: 15 },
      { header: 'Avg Innovation', key: 'avgInnovation', width: 15 },
      { header: 'Avg Presentation', key: 'avgPresentation', width: 18 },
      { header: 'Avg Relevance', key: 'avgRelevance', width: 15 },
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
        const avgCreativity = posterScores.reduce((sum, s) => sum + s.marksForCreativity, 0) / posterScores.length;
        const avgInnovation = posterScores.reduce((sum, s) => sum + s.marksForInnovation, 0) / posterScores.length;
        const avgPresentation = posterScores.reduce((sum, s) => sum + s.marksForPresentation, 0) / posterScores.length;
        const avgRelevance = posterScores.reduce((sum, s) => sum + s.marksForRelevance, 0) / posterScores.length;
        const avgTotal = posterScores.reduce((sum, s) => sum + s.marksForOverall, 0) / posterScores.length;

        summarySheet.addRow({
          posterId: poster.posterId,
          title: poster.title,
          judgesCount: posterScores.length,
          avgCreativity: avgCreativity.toFixed(2),
          avgInnovation: avgInnovation.toFixed(2),
          avgPresentation: avgPresentation.toFixed(2),
          avgRelevance: avgRelevance.toFixed(2),
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
