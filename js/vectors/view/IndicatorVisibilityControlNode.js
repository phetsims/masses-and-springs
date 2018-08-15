// Copyright 2017-2018, University of Colorado Boulder

/**
 * Panel that manages options for visibility of reference lines on vector screen.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var BracketNode = require( 'SCENERY_PHET/BracketNode' );
  var DisplacementArrowNode = require( 'MASSES_AND_SPRINGS/vectors/view/DisplacementArrowNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );

  // strings
  var massEquilibriumString = require( 'string!MASSES_AND_SPRINGS/massEquilibrium' );
  var movableLineString = require( 'string!MASSES_AND_SPRINGS/movableLine' );
  var displacementString = require( 'string!MASSES_AND_SPRINGS/displacement' );
  var naturalLengthString = require( 'string!MASSES_AND_SPRINGS/naturalLength' );
  var periodTraceString = require( 'string!MASSES_AND_SPRINGS/periodTrace' );

  // constants
  var CONTENT_MAX_WIDTH = 115;
  var CONTENT_SPACING = 37;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function IndicatorVisibilityControlNode( model, tandem, options ) {

    options = _.extend( {
      fill: MassesAndSpringsConstants.PANEL_FILL,
      tandem: tandem.createTandem( 'indicatorVisibilityControlNode' ),
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH + 10,
      periodTraceOption: false
    }, options );

    Node.call( this, options );

    // Lines added for reference in panel
    var blackLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'black', tandem.createTandem( 'blackLine' ) );
    var blueLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'rgb( 65, 66, 232 )', tandem.createTandem( 'blueLine' ) );
    var redLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'red', tandem.createTandem( 'redLine' ) );

    var displacementSymbol = new DisplacementArrowNode(
      new NumberProperty( 10 ),
      new BooleanProperty( true ),
      tandem,
      {
        modelViewTransform: this.modelViewTransform,
        symbolRepresentation: true,
        scale: 0.65
      }
    );
    var alignGroup = new AlignGroup( { matchVertical: false } );

    // Labels for the displacement arrow and natural length line
    var displacementLabels = new VBox( {
      spacing: 8,
      align: 'left',
      children: [
        new Text( displacementString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: 110,
          tandem: tandem.createTandem( 'displacementString' )
        } ),
        new Text( naturalLengthString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: 110,
          tandem: tandem.createTandem( 'naturalLengthString' )
        } ) ]
    } );

    // the bracket at the left - this is tweaked a bit for optimal appearance
    var bracket = new VBox( {
      children: [
        new BracketNode( {
          orientation: 'left',
          bracketLength: displacementLabels.height,
          bracketLineWidth: 2,
          bracketStroke: 'black',
          bracketTipLocation: 0.475,
          bracketEndRadius: 4,
          bracketTipRadius: 4

        } )
      ]
    } );

    var componentDisplacement = new AlignBox( new HBox( {
      spacing: 2,
      children: [ bracket, displacementLabels ]
    } ), { xAlign: 'left', group: alignGroup } );

    var massEquilibriumAlignBox = new AlignBox( new Text( massEquilibriumString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: CONTENT_MAX_WIDTH,
      tandem: tandem.createTandem( 'massEquilibriumString' )
    } ), { xAlign: 'left', group: alignGroup } );
    var movalbeLineAlignBox = new AlignBox( new Text( movableLineString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: CONTENT_MAX_WIDTH,
      tandem: tandem.createTandem( 'movableLineString' )
    } ), { xAlign: 'left', group: alignGroup } );

    // Create checkboxes using align boxes above
    var componentDisplacementVBox = new VBox( { children: [ displacementSymbol, blueLine ] } );
    componentDisplacementVBox.spacing = componentDisplacementVBox.height * 0.75;
    var indicatorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
      node: new HBox( {
        children: [ componentDisplacement, componentDisplacementVBox ],
        spacing: CONTENT_SPACING
      } ),
      property: model.naturalLengthVisibleProperty
    }, {
      node: new HBox( { children: [ massEquilibriumAlignBox, blackLine ], spacing: CONTENT_SPACING } ),
      property: model.equilibriumPositionVisibleProperty
    }, {
      node: new HBox( { children: [ movalbeLineAlignBox, redLine ], spacing: CONTENT_SPACING } ),
      property: model.movableLineVisibleProperty
    } ], {
      checkboxOptions: { boxWidth: 16 },
      spacing: 8,
      tandem: tandem.createTandem( 'indicatorVisibilityCheckboxGroup' )
    } );

    if ( options.periodTraceOption ) {
      indicatorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
        node: new HBox( {
          children: [ componentDisplacement, new VBox( { children: [ displacementSymbol, blueLine ] } ) ],
          spacing: CONTENT_SPACING
        } ),
        property: model.naturalLengthVisibleProperty
      }, {
        node: new HBox( { children: [ massEquilibriumAlignBox, blackLine ], spacing: CONTENT_SPACING } ),
        property: model.equilibriumPositionVisibleProperty
      }, {
        node: new HBox( { children: [ movalbeLineAlignBox, redLine ], spacing: CONTENT_SPACING } ),
        property: model.movableLineVisibleProperty
      }, {
        node: new Text( periodTraceString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: CONTENT_MAX_WIDTH,
          tandem: tandem.createTandem( 'periodTraceString' )
        } ),
        property: model.firstSpring.periodTraceVisibilityProperty
      } ], {
        boxWidth: 16,
        spacing: 8,
        tandem: tandem.createTandem( 'indicatorVisibilityCheckboxGroup' )
      } );
    }
    var indicatorVisibilityControlsVBox = new VBox( {
        children: [
          indicatorVisibilityCheckboxGroup
        ],
        align: 'left',
        tandem: tandem.createTandem( 'indicatorVisibilityControlsVBox' )
      }
    );
    this.addChild( indicatorVisibilityControlsVBox );
  }

  massesAndSprings.register( 'IndicatorVisibilityControlNode', IndicatorVisibilityControlNode );

  return inherit( Node, IndicatorVisibilityControlNode );
} );