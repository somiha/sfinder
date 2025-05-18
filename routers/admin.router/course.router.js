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

courseRouter.get("/course", isLogged, getCourse);
courseRouter.get("/course-details/:id", isLogged, getCourseDetails);
courseRouter.get("/course-category", isLogged, getCourseCategory);
courseRouter.post(
  "/add-course-category",
  isLogged,
  upload.single("category_image"),
  addCourseCategory
);
courseRouter.post(
  "/edit-course-category/:id",
  isLogged,
  upload.single("category_image"),
  editCourseCategory
);
courseRouter.get("/delete-course-category/:id", isLogged, deleteCourseCategory);
courseRouter.get("/course-enrollment", isLogged, getCourseEnrollment);
courseRouter.post(
  "/change-course-enrollment-status/:id",
  isLogged,
  upload.none(),
  changeCourseEnrollmentStatus
);
courseRouter.get("/course-materials/:id", isLogged, getCourseMaterials);
courseRouter.post(
  "/add-course-material",
  isLogged,
  upload.single("material_file"),
  addCourseMaterial
);
courseRouter.post(
  "/edit-course-material",
  isLogged,
  upload.single("material_file"),
  editCourseMaterial
);
courseRouter.get("/delete-course-material", isLogged, deleteCourseMaterial);
courseRouter.get("/add-course", isLogged, getAddCourse);
courseRouter.post(
  "/add-course",
  isLogged,
  upload.single("course_cover_image"),
  addCourse
);
courseRouter.get("/delete-course/:id", isLogged, deleteCourse);
courseRouter.get("/edit-course/:id", isLogged, getEditCourse);
courseRouter.post(
  "/edit-course/:id",
  isLogged,
  upload.single("course_cover_image"),
  editCourse
);
courseRouter.get("/course-benefits/:id", isLogged, getCourseBenefits);
courseRouter.post(
  "/add-course-benefit",
  isLogged,
  upload.none(),
  addCourseBenefit
);
courseRouter.post(
  "/edit-course-benefit",
  isLogged,
  upload.none(),
  editCourseBenefit
);
courseRouter.get("/delete-course-benefit", isLogged, deleteCourseBenefit);

courseRouter.get("/course-instructor", isLogged, getCourseInstructor);
courseRouter.post(
  "/add-course-instructor",
  isLogged,
  upload.single("instructor_image"),
  addCourseInstructor
);
courseRouter.get(
  "/delete-course-instructor/:id",
  isLogged,
  deleteCourseInstructor
);
courseRouter.post(
  "/edit-course-instructor/:course_instructor_id",
  isLogged,
  upload.single("instructor_image"),
  editCourseInstructor
);

module.exports = courseRouter;
