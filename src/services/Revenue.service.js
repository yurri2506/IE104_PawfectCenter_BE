const Order = require('../models/Order.model')

const getRevenue = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const now = new Date();

            // Ngày bắt đầu và kết thúc của hôm nay
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

            // Ngày bắt đầu và kết thúc của tháng hiện tại
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

            // Ngày bắt đầu và kết thúc của năm hiện tại
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

            // Doanh thu ngày hôm nay
            const dailyRevenue = await Order.aggregate([
                {
                    $match: {
                        order_status: 'Giao hàng thành công',
                        estimated_delivery_date: { $gte: startOfToday, $lte: endOfToday },
                    },
                },
                {
                    $group: {
                        _id: "$order_payment",
                        totalRevenue: {
                            $sum: { $subtract: ["$order_total_after", "$shipping_fee"] },
                        },
                    },
                },
            ]);

            // Doanh thu tháng hiện tại
            const monthlyRevenue = await Order.aggregate([
                {
                    $match: {
                        order_status: 'Giao hàng thành công',
                        estimated_delivery_date: { $gte: startOfMonth, $lte: endOfMonth },
                    },
                },
                {
                    $group: {
                        _id: "$order_payment",
                        totalRevenue: {
                            $sum: { $subtract: ["$order_total_after", "$shipping_fee"] },
                        },
                    },
                },
            ]);

            // Doanh thu năm hiện tại
            const yearlyRevenue = await Order.aggregate([
                {
                    $match: {
                        order_status: 'Giao hàng thành công',
                        estimated_delivery_date: { $gte: startOfYear, $lte: endOfYear },
                    },
                },
                {
                    $group: {
                        _id: "$order_payment",
                        totalRevenue: {
                            $sum: { $subtract: ["$order_total_after", "$shipping_fee"] },
                        },
                    },
                },
            ]);

            // Doanh thu từng tháng của từng năm
            const monthlyBreakdownPerYear = await Order.aggregate([
                {
                    $match: {
                        order_status: 'Giao hàng thành công',
                        estimated_delivery_date: { $exists: true }, // Chỉ tính các đơn hàng có estimated_delivery_date
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$estimated_delivery_date" },
                            month: { $month: "$estimated_delivery_date" },
                        },
                        totalRevenue: {
                            $sum: { $subtract: ["$order_total_after", "$shipping_fee"] },
                        },
                    },
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 }, // Sắp xếp theo năm và tháng
                },
            ]);

            // Tạo danh sách doanh thu đầy đủ (bao gồm tháng không có dữ liệu)
            const years = [...new Set(monthlyBreakdownPerYear.map(item => item._id.year))];
            const fullMonthlyBreakdownPerYear = years.map(year => {
                const monthlyData = Array.from({ length: 12 }, (_, i) => {
                    const monthData = monthlyBreakdownPerYear.find(
                        item => item._id.year === year && item._id.month === i + 1
                    );
                    return {
                        month: i + 1,
                        totalRevenue: monthData ? monthData.totalRevenue : 0,
                    };
                });
                return { year, monthlyData };
            });

            return resolve({
                status: "OK",
                message: "Tính doanh thu thành công",
                dailyRevenue,
                monthlyRevenue,
                yearlyRevenue,
                monthlyBreakdownPerYear: fullMonthlyBreakdownPerYear,
            });
        } catch (error) {
            return reject({
                status: "ERROR",
                message: error.message,
            });
        }
    });
};




module.exports = {
    getRevenue
}