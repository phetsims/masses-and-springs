// Copyright 2016, University of Colorado Boulder

/**
 *
 *
 * @author Matt Pennington
 */

define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Bounds2 = require( 'DOT/Bounds2' );



  /**
   * @param {Mass} Mass model object
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function MassNode( mass, mvt ) {
    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    var viewBounds = new Bounds2(
      mvt.modelToViewDeltaX( -mass.radius ),
      0,
      mvt.modelToViewDeltaX( mass.radius ),
      mvt.modelToViewDeltaY( -mass.height )
    );
    var rect = Rectangle.bounds( viewBounds, { fill: 'red' } );
    this.addChild( rect );

    mass.positionProperty.link( function( position ) {
      self.translation = mvt.modelToViewPosition( position );
    } );

    self.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the particle in model space.
      translate: function( translationParams ) {
        //mass.position = mass.position.plus( mvt.viewToModelDelta( translationParams.delta ) );
        mass.position = mass.position.plus( mvt.viewToModelDelta( translationParams.delta ) );
        return translationParams.position;
      },

      start: function( event, trail ) {
        mass.userControlled = true;
      },

      end: function( event, trail ) {
        mass.userControlled = false;
      }
    } ) );

  }

  massesAndSprings.register( 'MassNode', MassNode );
  return inherit( Node, MassNode );

} );