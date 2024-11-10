import { ResponseError } from "../error/responseError.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../app/database.js";
import tutorValidation from "../validation/tutorValidation.js";

const register = async (req) => {
  const registerTutorRequest = validate(tutorValidation.registerTutorValidation, req.body);
  const existingUserAsTutorCount = await prismaClient.tutor.count({
    where: {
      userId: req.user.userId,
    },
  });
  if (existingUserAsTutorCount != 0) {
    throw new ResponseError(400, "User Already Registered as Tutor");
  }

  registerTutorRequest.userId = req.user.userId;

  return await prismaClient.tutor.create({
    data: registerTutorRequest,
    select: {
      tutorId: true,
      tutorTitle: true,
      tutorDesc: true,
      userId: true,
      user: {
        select: {
          fullName: true,
          email: true,
          noHp: true,
          profilePicture: true,
        },
      },
    },
  });
};

const getAll = async (request = "") => {
  const tutors = await prismaClient.tutor.findMany({
    select: {
      tutorId: true,
      tutorTitle: true,
      tutorDesc: true,
      userId: true,
      user: {
        select: {
          fullName: true,
          email: true,
          noHp: true,
          profilePicture: true,
        },
      },
    },
  });
  if (request !== "") {
    return await prismaClient.tutor.findMany({
      where: {
        OR: [
          {
            tutorTitle: {
              contains: request,
            },
          },
          {
            tutorDesc: {
              contains: request,
            },
          },
          {
            user: {
              fullName: {
                contains: request,
              },
            },
          },
        ],
      },
      select: {
        tutorId: true,
        tutorTitle: true,
        tutorDesc: true,
        userId: true,
        user: {
          select: {
            fullName: true,
            email: true,
            noHp: true,
            profilePicture: true,
          },
        },
      },
    });
  }
  return tutors;
};

const getById = async (req) => {
  const tutor = await prismaClient.tutor.findFirst({
    where: {
      tutorId: req,
    },
    select: {
      tutorId: true,
      tutorTitle: true,
      tutorDesc: true,
      userId: true,
      user: {
        select: {
          fullName: true,
          email: true,
          noHp: true,
          profilePicture: true,
        },
      },
    },
  });
  if (!tutor) {
    throw new ResponseError(404, "Invalid Tutor Id");
  }
  return tutor;
};

const updateTutor = async (req) => {
  const updatedTutorInfo = validate(tutorValidation.updateTutorValidation, req.body);
  const existingTutorCount = await prismaClient.tutor.count({
    where: {
      userId: req.user.userId,
    },
  });
  if (existingTutorCount == 0) {
    throw new ResponseError(400, "User Not Registered As Tutor");
  }

  const data = {};
  if (updatedTutorInfo.tutorTitle) {
    data.tutorTitle = updatedTutorInfo.tutorTitle;
  }
  if (updatedTutorInfo.tutorDesc) {
    data.tutorDesc = updatedTutorInfo.tutorDesc;
  }
  return await prismaClient.tutor.update({
    where: {
      userId: req.user.userId,
    },
    data: data,
    select: {
      tutorId: true,
      tutorTitle: true,
      tutorDesc: true,
      userId: true,
      user: {
        select: {
          fullName: true,
          email: true,
          noHp: true,
          profilePicture: true,
        },
      },
    },
  });
};

export default {
  register,
  getAll,
  getById,
  updateTutor,
};
