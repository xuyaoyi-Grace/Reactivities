using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Predicate { get; set; } = "future";
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.ActivityAttendees
                    .Where(x => x.AppUser.UserName == request.Username)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .OrderBy(d => d.Date)
                    .AsQueryable();

                if (request.Predicate=="future") 
                    query = query.Where(x => ( 
                    x.Date >= DateTime.UtcNow && x.HostUsername != request.Username));

                if (request.Predicate=="past") 
                    query = query.Where(x => (
                    x.Date < DateTime.UtcNow));

                if (request.Predicate=="hosting") 
                    query = query.Where(x => (
                    x.HostUsername == request.Username));
                
                return Result<List<UserActivityDto>>.Success(
                    await query.ToListAsync()
                );
            }
        }
    }
}