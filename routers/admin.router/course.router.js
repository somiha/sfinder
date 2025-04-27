const express = require("express");
const {
  getCourse,
  getCourseDetails,
  getCourseCategory,
  addCourseCategory,
  editCourseCategory,
  deleteCourseCategory,
  getCourseEnrollment,
  changeCourseEnrollmentStatus,
  getCourseMaterials,
  addCourseMaterial,
  editCourseMaterial,
  deleteCourseMaterial,
  getAddCourse,
  addCourse,
  deleteCourse,
  getEditCourse,
  editCourse,
  getCourseBenefits,
  addCourseBenefit,
  editCourseBenefit,
  deleteCourseBenefit,
  getCourseInstructor,
  addCourseInstructor,
  deleteCourseInstructor,
  editCourseInstructor,
} = require("../../controllers/course.controller");
const courseRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

courseRouter.get("/course", getCourse);
courseRouter.get("/course-details/:id", getCourseDetails);
courseRouter.get("/course-category", getCourseCategory);
courseRouter.post(
  "/add-course-category",
  upload.single("category_image"),
  addCourseCategory
);
courseRouter.post(
  "/edit-course-category/:id",
  upload.single("category_image"),
  editCourseCategory
);
courseRouter.get("/delete-course-category/:id", deleteCourseCategory);
courseRouter.get("/course-enrollment", getCourseEnrollment);
courseRouter.post(
  "/change-course-enrollment-status/:id",
  upload.none(),
  changeCourseEnrollmentStatus
);
courseRouter.get("/course-materials/:id", getCourseMaterials);
courseRouter.post(
  "/add-course-material",
  upload.single("material_file"),
  addCourseMaterial
);
courseRouter.post(
  "/edit-course-material",
  upload.single("material_file"),
  editCourseMaterial
);
courseRouter.get("/delete-course-material", deleteCourseMaterial);
courseRouter.get("/add-course", getAddCourse);
courseRouter.post(
  "/add-course",
  upload.single("course_cover_image"),
  addCourse
);
courseRouter.get("/delete-course/:id", deleteCourse);
courseRouter.get("/edit-course/:id", getEditCourse);
courseRouter.post(
  "/edit-course/:id",
  upload.single("course_cover_image"),
  editCourse
);
courseRouter.get("/course-benefits/:id", getCourseBenefits);
courseRouter.post("/add-course-benefit", upload.none(), addCourseBenefit);
courseRouter.post("/edit-course-benefit", upload.none(), editCourseBenefit);
courseRouter.get("/delete-course-benefit", deleteCourseBenefit);

courseRouter.get("/course-instructor", getCourseInstructor);
courseRouter.post(
  "/add-course-instructor",
  upload.single("instructor_image"),
  addCourseInstructor
);
courseRouter.get("/delete-course-instructor/:id", deleteCourseInstructor);
courseRouter.post(
  "/edit-course-instructor/:course_instructor_id",
  upload.single("instructor_image"),
  editCourseInstructor
);

module.exports = courseRouter;
